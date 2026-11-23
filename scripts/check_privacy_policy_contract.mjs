import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RETIRED_FOOTER_EMAIL = ['info', 'seatree.gr'].join('@');

const PRIVACY_PAGES = [
  {
    file: 'privacy/index.html',
    updated: 'Last updated: 23 November 2026',
    noForm: ['no contact form', 'There is no form on this site.'],
    noAnalytics: ['does not use Google Analytics', 'do not currently use Google Analytics'],
    retention: ['12 months', 'five (5) years'],
  },
  {
    file: 'el/privacy/index.html',
    updated: 'Τελευταία ενημέρωση: 23 Νοεμβρίου 2026',
    noForm: ['Δεν έχει φόρμα', 'Δεν υπάρχει φόρμα στο site.'],
    noAnalytics: ['δεν χρησιμοποιεί Google Analytics', 'Δεν χρησιμοποιούμε αυτή τη στιγμή Google Analytics'],
    retention: ['12 μήνες', '(5) έτη'],
  },
  {
    file: 'es/privacy/index.html',
    updated: 'Última actualización: 23 de noviembre de 2026',
    noForm: ['No tiene formulario de contacto', 'No hay formulario en este sitio.'],
    noAnalytics: ['no utiliza Google Analytics', 'no utilizamos Google Analytics'],
    retention: ['12 meses', 'cinco (5) años'],
  },
  {
    file: 'fr/privacy/index.html',
    updated: 'Dernière mise à jour : 23 novembre 2026',
    noForm: ['pas de formulaire de contact', 'pas de formulaire sur ce site.'],
    noAnalytics: ['n’utilise pas Google Analytics', 'n’utilisons pas actuellement Google Analytics'],
    retention: ['12 mois', 'cinq (5) ans'],
  },
];

const PRIVACY_CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: https:",
  "connect-src 'self'",
].join('; ');

const FORBIDDEN = [
  [/Stripe/i, 'Stripe'],
  [/Viva/i, 'Viva'],
  [/_ga\b/, '_ga'],
  [/googletagmanager\.com/, 'googletagmanager.com'],
  [/\bgtag\b/, 'gtag'],
  [/consent-banner/, 'cookie consent banner'],
  [/cookie banner/i, 'cookie banner'],
  [/banner cookies/i, 'banner cookies'],
  [/banner de cookies/i, 'banner de cookies'],
  [/bandeau cookies/i, 'bandeau cookies'],
  [/Google Analytics 4/, 'Google Analytics 4 as an active tool'],
  [/analytics cookies/i, 'analytics cookies as something the site uses'],
  [/cookies anal[ií]ticas/i, 'analytics cookies as something the site uses'],
  [/cookies analytiques/i, 'analytics cookies as something the site uses'],
];

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function assertPrivacyPage(page) {
  const html = readProjectFile(page.file);

  for (const [pattern, label] of FORBIDDEN) {
    assert.doesNotMatch(html, pattern, `${page.file} must not mention ${label}`);
  }

  assert.match(html, /Google Maps/, `${page.file} must say the homepage embeds Google Maps`);
  assert.match(html, /ΑΚΤΑΙ ΠΑΡΟΥ Ι\.Κ\.Ε\./, `${page.file} must name ΑΚΤΑΙ ΠΑΡΟΥ Ι.Κ.Ε.`);
  assert.match(html, /802416469/, `${page.file} must include VAT 802416469`);
  assert.match(html, /antocosto@gmail\.com/, `${page.file} must give antocosto@gmail.com`);
  for (const phrase of page.noForm) {
    assert.ok(html.includes(phrase), `${page.file} must say there is no contact form ("${phrase}")`);
  }
  for (const phrase of page.noAnalytics) {
    assert.ok(html.includes(phrase), `${page.file} must say Google Analytics is not in use ("${phrase}")`);
  }
  for (const phrase of page.retention) {
    assert.ok(html.includes(phrase), `${page.file} must state the retention period ("${phrase}")`);
  }
  assert.ok(html.includes(page.updated), `${page.file} must be dated ${page.updated}`);

  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)[^>]*>/i, `${page.file} must not add an inline script`);
  assert.match(
    html,
    new RegExp(`content="${PRIVACY_CSP.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`),
    `${page.file} must keep a strict self CSP without analytics hosts`
  );
  const scriptSrcs = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scriptSrcs, ['/translations.js', '/script.js'], `${page.file} must not load analytics scripts`);
}

function siteContentFiles(dir = ROOT, found = []) {
  const skip = new Set([
    '.git',
    'node_modules',
    'archive',
    'reference',
    'docs',
    '.agent',
    '.agents',
    '.github',
    '.codex',
    '.antigravity',
    '.claude',
    '.lh-chrome',
    'test-results',
    'playwright-report',
    'blob-report',
  ]);

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (skip.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      siteContentFiles(fullPath, found);
      continue;
    }
    if (/\.(html|js|css|txt|xml|json)$/.test(entry.name)) found.push(fullPath);
  }
  return found;
}

export function assertPrivacyPolicyContract() {
  for (const page of PRIVACY_PAGES) assertPrivacyPage(page);

  const retired = new RegExp(RETIRED_FOOTER_EMAIL.replace(/[.]/g, '\\.'), 'g');
  for (const filePath of siteContentFiles()) {
    const relativePath = path.relative(ROOT, filePath);
    assert.doesNotMatch(
      fs.readFileSync(filePath, 'utf8'),
      retired,
      `${relativePath} must not publish ${RETIRED_FOOTER_EMAIL}`
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertPrivacyPolicyContract();
}
