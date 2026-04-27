import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const LOCALES = [
  { path: '/', lang: 'en', label: 'EN' },
  { path: '/es/', lang: 'es', label: 'ES' },
  { path: '/el/', lang: 'el', label: 'EL' },
  { path: '/fr/', lang: 'fr', label: 'FR' },
];

test.describe('mobile layout', () => {
  test.beforeEach(({ }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'mobile-only suite');
  });

  for (const locale of LOCALES) {
    test(`${locale.label}: no horizontal page overflow`, async ({ page }) => {
      await page.goto(locale.path);
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
      // Wait for service worker registration prompt to flush; lazy images
      // have already shown their alt by now.
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
