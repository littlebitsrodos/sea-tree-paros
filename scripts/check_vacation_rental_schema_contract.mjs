import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function extractVacationRentalSchema() {
  const indexHtml = readProjectFile('index.html');
  const matches = [...indexHtml.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  const vacationRentalScript = matches
    .map((match) => JSON.parse(match[1]))
    .find((schema) => schema['@type'] === 'VacationRental');

  assert.ok(vacationRentalScript, 'index.html must contain a VacationRental JSON-LD block');
  return vacationRentalScript;
}

function assertOccupancyShape(node, label) {
  assert.ok(node.occupancy, `${label} must define occupancy`);
  assert.equal(node.occupancy['@type'], 'QuantitativeValue', `${label} occupancy must be a QuantitativeValue`);
  assert.equal(typeof node.occupancy.value, 'number', `${label} occupancy.value must be a number`);
}

function assertJsonLdCspHashes() {
  const indexHtml = readProjectFile('index.html');
  const policy = indexHtml.match(/http-equiv="Content-Security-Policy"[\s\S]*?content="([^"]*)"/)?.[1];
  assert.ok(policy, 'index.html must include a Content-Security-Policy meta tag');

  const scriptSrc = policy.split(';').map((part) => part.trim()).find((part) => part.startsWith('script-src'));
  assert.ok(scriptSrc, 'CSP must include script-src');
  assert.equal(scriptSrc.includes("'unsafe-inline'"), false, 'script-src must not allow unsafe-inline');

  // validator.w3.org/nu hashes inline script text after trimming the ends.
  // Browsers do not run application/ld+json, so these hashes are for the checker.
  const blocks = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  assert.ok(blocks.length >= 2, 'index.html must include the JSON-LD data blocks');
  for (const block of blocks) {
    const hash = createHash('sha256').update(block[1].trim()).digest('base64');
    assert.ok(scriptSrc.includes(`'sha256-${hash}'`), `script-src is missing sha256-${hash} for a JSON-LD block`);
  }
}

export function assertVacationRentalSchemaContract() {
  assertJsonLdCspHashes();
  const schema = extractVacationRentalSchema();

  assert.equal(typeof schema.identifier, 'string', 'VacationRental identifier must be a string');
  assert.match(schema.identifier, /\S/, 'VacationRental identifier must not be empty');
  assert.equal(schema.hasMap, 'https://www.google.com/maps/search/?api=1&query=36.9932,25.0518', 'VacationRental must expose a map URL');

  assert.ok(Array.isArray(schema.sameAs), 'VacationRental sameAs must be an array');
  assert.ok(
    schema.sameAs.includes('https://www.airbnb.com/rooms/1659626910469787873'),
    'VacationRental sameAs must include Airbnb'
  );
  assert.ok(
    schema.sameAs.includes('https://www.booking.com/hotel/gr/aliki-seafront-luxury-apartment.en-gb.html'),
    'VacationRental sameAs must include Booking.com'
  );

  const amenityNames = new Set(schema.amenityFeature?.map((amenity) => amenity.name));
  for (const requiredAmenity of ['wifi', 'ac', 'kitchen', 'beachAccess', 'washerDryer']) {
    assert.ok(amenityNames.has(requiredAmenity), `VacationRental amenities must include ${requiredAmenity}`);
  }

  assertOccupancyShape(schema, 'VacationRental');

  assert.ok(Array.isArray(schema.containsPlace), 'VacationRental containsPlace must be an array');
  assert.ok(schema.containsPlace.length > 0, 'VacationRental containsPlace must not be empty');
  assert.ok(
    schema.containsPlace.some((place) => place.additionalType === 'EntirePlace'),
    'VacationRental containsPlace must include the entire place'
  );

  for (const place of schema.containsPlace) {
    assertOccupancyShape(place, `containsPlace "${place.name ?? 'unknown'}"`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertVacationRentalSchemaContract();
}
