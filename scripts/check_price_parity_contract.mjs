import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function extractVacationRentalSchema(indexHtml) {
  const matches = [...indexHtml.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  const schema = matches
    .map((match) => JSON.parse(match[1]))
    .find((candidate) => candidate['@type'] === 'VacationRental');

  assert.ok(schema, 'index.html must contain a VacationRental JSON-LD block');
  return schema;
}

function extractScriptPricing() {
  const script = readProjectFile('script.js');
  const pricingBlock = script.match(/const\s+PRICING\s*=\s*(\{[\s\S]*?\n\});/)?.[1];
  assert.ok(pricingBlock, 'script.js must define PRICING');

  const pricing = new Function(`return (${pricingBlock});`)();
  assert.equal(pricing.currency, '€', 'PRICING currency must be euro');
  return pricing;
}

function extractLegendPrices(indexHtml) {
  const legendMatches = [
    ...indexHtml.matchAll(
      /<span class="pricing-dot (low|mid|peak)"><\/span>\s*<span>[^<]+<strong>€(\d+)<\/strong>\/night<\/span>/g
    ),
  ];

  assert.equal(legendMatches.length, 3, 'pricing legend must expose low, mid, and peak nightly rates');
  return Object.fromEntries(legendMatches.map((match) => [match[1], Number(match[2])]));
}

function extractPriceRange(priceRange) {
  assert.equal(typeof priceRange, 'string', 'VacationRental priceRange must be a string');
  const match = priceRange.match(/^€(\d+)-€(\d+) per night$/);
  assert.ok(match, 'VacationRental priceRange must use "€MIN-€MAX per night" format');
  return { min: Number(match[1]), max: Number(match[2]) };
}

export function assertPriceParityContract() {
  const indexHtml = readProjectFile('index.html');
  const schema = extractVacationRentalSchema(indexHtml);
  const pricing = extractScriptPricing();
  const legendPrices = extractLegendPrices(indexHtml);

  const expectedSeasons = ['low', 'mid', 'peak'];
  assert.deepEqual(Object.keys(pricing.seasons).sort(), expectedSeasons, 'PRICING seasons must be low/mid/peak');
  assert.deepEqual(Object.keys(legendPrices).sort(), expectedSeasons, 'pricing legend seasons must be low/mid/peak');

  const nightlyRates = expectedSeasons.map((season) => {
    const config = pricing.seasons[season];
    assert.equal(typeof config.nightly, 'number', `${season} nightly rate must be numeric`);
    assert.ok(config.nightly > 0, `${season} nightly rate must be positive`);
    assert.equal(config.weekly, config.nightly, `${season} weekly placeholder must match nightly rate until weekly pricing is implemented`);
    assert.deepEqual(legendPrices[season], config.nightly, `${season} legend price must match script.js PRICING`);
    return config.nightly;
  });

  const schemaRange = extractPriceRange(schema.priceRange);
  assert.equal(schemaRange.min, Math.min(...nightlyRates), 'schema priceRange min must match lowest nightly rate');
  assert.equal(schemaRange.max, Math.max(...nightlyRates), 'schema priceRange max must match highest nightly rate');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertPriceParityContract();
}
