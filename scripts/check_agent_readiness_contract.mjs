import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LOCALE_PAGES = ['index.html', 'es/index.html', 'el/index.html', 'fr/index.html'];

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function jsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

export function assertAgentReadinessContract() {
  const llms = readProjectFile('llms.txt');
  assert.match(llms, /when to use this site/i, 'llms.txt must tell agents when to use the site');
  assert.match(llms, /https:\/\/seatree\.gr\/sitemap\.xml/, 'llms.txt must link the sitemap');
  for (const href of ['https://seatree.gr/', 'https://seatree.gr/es/', 'https://seatree.gr/el/', 'https://seatree.gr/fr/']) {
    assert.ok(llms.includes(href), `llms.txt must link ${href}`);
  }

  const notFound = readProjectFile('404.html');
  assert.match(notFound, /404/, '404.html must explain that the page was not found');
  assert.match(notFound, /href="\/sitemap\.xml"/, '404.html must link the sitemap');
  assert.match(notFound, /href="\/llms\.txt"/, '404.html must link llms.txt');

  for (const page of LOCALE_PAGES) {
    const blocks = jsonLdBlocks(readProjectFile(page));
    const organization = blocks.find((block) => block['@type'] === 'Organization');
    assert.ok(organization, `${page} must include Organization JSON-LD`);
    assert.equal(organization.name, 'The SeaTree', `${page} Organization name must stay The SeaTree`);
    assert.equal(organization.url, 'https://seatree.gr/', `${page} Organization url must be the public site`);
    const point = organization.contactPoint;
    assert.equal(point?.['@type'], 'ContactPoint', `${page} Organization needs a ContactPoint`);
    assert.equal(typeof point.contactType, 'string', `${page} contactPoint.contactType must be set`);
    assert.ok(point.email || point.telephone, `${page} contactPoint needs a public email or telephone`);
    assert.equal(point.email, 'antocosto@gmail.com', `${page} contact email must stay the public enquiry address`);
    assert.equal(point.telephone, '+306973286811', `${page} contact telephone must stay the public number`);
    assert.equal(organization.address?.['@type'], 'PostalAddress', `${page} Organization needs a PostalAddress`);
    assert.equal(organization.address.addressLocality, 'Aliki');
    assert.equal(organization.address.postalCode, '844 00');
    assert.equal(organization.address.addressCountry, 'GR');
    assert.ok(
      blocks.some((block) => block['@type'] === 'VacationRental'),
      `${page} must keep VacationRental JSON-LD`
    );
    assert.ok(
      blocks.some((block) => block['@type'] === 'WebSite'),
      `${page} must keep WebSite JSON-LD`
    );
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertAgentReadinessContract();
}
