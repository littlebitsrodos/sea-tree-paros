import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const LOCALES = [
  { path: '/', lang: 'en', label: 'EN' },
  { path: '/es/', lang: 'es', label: 'ES' },
  { path: '/el/', lang: 'el', label: 'EL' },
  { path: '/fr/', lang: 'fr', label: 'FR' },
];

async function waitForSiteStyles(page) {
  const stylesReady = () => {
    const nav = document.querySelector('.navbar');
    return nav && getComputedStyle(nav).position === 'fixed';
  };

  try {
    await page.waitForFunction(stylesReady, { timeout: 5000 });
  } catch {
    await page.reload({ waitUntil: 'load' });
    await page.waitForFunction(stylesReady, { timeout: 5000 });
  }
}

// Block third-party analytics network calls in tests — keeps networkidle
// deterministic and prevents gtag.js fetches from racing with axe scans
// or overflow measurements. analytics.js (same-origin) still runs and
// sets up Consent Mode defaults.
test.beforeEach(async ({ context }) => {
  await context.route(/googletagmanager\.com|google-analytics\.com|analytics\.google\.com/, route => route.abort());
});

// Pre-seed the cookie-consent decision so the banner doesn't render during
// layout/a11y tests — it's a fixed-positioned overlay whose presence on
// first-visit was racing with body.scrollWidth measurement. The consent
// suite below opts out so it can exercise the first-visit flow.
test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.titlePath.some(p => p.includes('cookie consent'))) return;
  await page.addInitScript(() => {
    try { localStorage.setItem('seatree-consent', 'denied'); } catch (_) {}
  });
});

test.describe('mobile layout', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only suite');
  });

  for (const locale of LOCALES) {
    test(`${locale.label}: no horizontal page overflow`, async ({ page }) => {
      await page.goto(locale.path);
      await waitForSiteStyles(page);
      const overflow = await page.evaluate(() => ({
        bodyScrollWidth: document.body.scrollWidth,
        viewportWidth: window.innerWidth,
      }));
      // Catches the calendar-grid 7th-column overflow (ISSUE-003) and any
      // future element that pushes the page wider than the viewport.
      expect(overflow.bodyScrollWidth).toBeLessThanOrEqual(overflow.viewportWidth);
    });

    test(`${locale.label}: calendar shows all 7 weekday columns`, async ({ page }) => {
      await page.goto(locale.path);
      await waitForSiteStyles(page);
      const calendar = page.locator('.calendar');
      await calendar.scrollIntoViewIfNeeded();
      const headers = calendar.locator('.calendar-header');
      await expect(headers).toHaveCount(7);
      const lastHeaderRight = await headers.last().evaluate(el => el.getBoundingClientRect().right);
      const viewportWidth = await page.evaluate(() => window.innerWidth);
      // Saturday must fit inside the viewport.
      expect(lastHeaderRight).toBeLessThanOrEqual(viewportWidth);
    });

    test(`${locale.label}: gallery carousel slides align with the track`, async ({ page }) => {
      await page.goto(locale.path);
      await waitForSiteStyles(page);
      const carousel = page.locator('.gallery-carousel');
      await carousel.scrollIntoViewIfNeeded();
      const trackWidth = await carousel.evaluate(el => el.getBoundingClientRect().width);
      const slideWidths = await carousel.locator('.carousel-slide').evaluateAll(slides =>
        slides.map(s => s.getBoundingClientRect().width)
      );
      // Catches ISSUE-004 — slides must all be exactly the track width so
      // translateX(-i * 100%) lands cleanly. Allow ±0.5px float wobble.
      for (const w of slideWidths) {
        expect(Math.abs(w - trackWidth)).toBeLessThan(1);
      }
    });
  }
});

test.describe('a11y — axe-core', () => {
  for (const locale of LOCALES) {
    test(`${locale.label}: no critical or serious violations`, async ({ page }) => {
      await page.goto(locale.path);
      await waitForSiteStyles(page);
      // Let lazy image/network churn settle before axe scans dynamic sections.
      await page.waitForLoadState('networkidle').catch(() => { /* sw runs forever */ });
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const blocking = results.violations.filter(v =>
        v.impact === 'critical' || v.impact === 'serious'
      );
      // Print full violation table so failures are debuggable in CI logs.
      if (blocking.length > 0) {
        const summary = blocking.map(v => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.length,
          first: v.nodes[0]?.target,
        }));
        console.log('axe violations:', JSON.stringify(summary, null, 2));
      }
      // Catches ISSUE-001 (h3 invisible) — that was a 1:1 contrast
      // ratio rendered as a critical color-contrast violation.
      expect(blocking).toEqual([]);
    });
  }
});

test.describe('navigation', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only suite');
  });

  test('hamburger opens the nav drawer and a link scrolls to its section', async ({ page }) => {
    await page.goto('/');
    await page.locator('.mobile-menu-btn').click();
    const navLinks = page.locator('.nav-links.active');
    await expect(navLinks).toBeVisible();
    await navLinks.locator('a[href="#gallery"]').click();
    // Drawer closes after navigation
    await expect(page.locator('.nav-links.active')).toHaveCount(0);
    // Gallery section is in the viewport
    const gallery = page.locator('#gallery');
    await expect(gallery).toBeInViewport({ ratio: 0.1 });
  });

  test('language switcher navigates to the locale URL', async ({ page }) => {
    await page.goto('/');
    await page.locator('.lang-btn[data-lang="es"]').click();
    await expect(page).toHaveURL(/\/es\/?$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  });
});

test.describe('gallery interactions', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'desktop-only suite');
  });

  test('desktop gallery opens the lightbox', async ({ page }) => {
    await page.goto('/');
    await waitForSiteStyles(page);

    await page.locator('.gallery-grid .gallery-item').first().click();

    const lightbox = page.locator('.lightbox.active');
    await expect(lightbox).toBeVisible();
    await expect(lightbox.locator('img')).toHaveAttribute('src', /.+/);
  });
});

test.describe('cookie consent (GA4 Consent Mode v2)', () => {
  // Paused 2026-04-30: GA4 disabled until correct seatree.gr Property ID arrives;
  // banner is suppressed in script.js. Re-enable when initConsentBanner() is restored.
  test.skip();
  test('banner appears for first-time visitors and persists the decision', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#consent-banner');
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/cookies/i);

    await banner.locator('.consent-accept').click();
    await expect(banner).toBeHidden();

    const stored = await page.evaluate(() => localStorage.getItem('seatree-consent'));
    expect(stored).toBe('granted');

    // Reload — banner should NOT reappear
    await page.reload();
    await expect(page.locator('#consent-banner')).toBeHidden();
  });

  test('decline path stores denied state and hides the banner', async ({ page }) => {
    await page.goto('/');
    const banner = page.locator('#consent-banner');
    await expect(banner).toBeVisible();
    await banner.locator('.consent-decline').click();
    await expect(banner).toBeHidden();
    const stored = await page.evaluate(() => localStorage.getItem('seatree-consent'));
    expect(stored).toBe('denied');
  });
});
