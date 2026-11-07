import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// schema.org domainIncludes for these properties is Accommodation (and a few
// other non-VacationRental types). validator.schema.org warns when they are
// declared on VacationRental itself. The same facts stay valid on containsPlace.
const UNRECOGNIZED_VACATION_RENTAL_PROPERTIES = [
  'numberOfBedrooms',
  'numberOfBathroomsTotal',
  'occupancy',
];

const LOCALE_PAGES = ['index.html', 'es/index.html', 'el/index.html', 'fr/index.html'];

const EXPECTED_ACCOMMODATION_FACTS = [
  {
    name: 'The SeaTree beachfront apartment',
    numberOfBedrooms: 2,
    numberOfBathroomsTotal: 2,
    occupancy: { '@type': 'QuantitativeValue', value: 4, maxValue: 4 },
  },
  {
    name: 'Master Bedroom',
    numberOfBedrooms: 1,
    numberOfBathroomsTotal: 1,
    occupancy: { '@type': 'QuantitativeValue', value: 2, maxValue: 2 },
  },
  {
    name: 'Guest Bedroom',
    numberOfBedrooms: 1,
    numberOfBathroomsTotal: 1,
    occupancy: { '@type': 'QuantitativeValue', value: 2, maxValue: 2 },
  },
];

function readProjectFile(filePath) {
  return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function extractVacationRentalSchema(page) {
  const html = readProjectFile(page);
  const matches = [...html.matchAll(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/g)];
  const vacationRentalScript = matches
    .map((match) => JSON.parse(match[1]))
    .find((schema) => schema['@type'] === 'VacationRental');

  assert.ok(vacationRentalScript, `${page} must contain a VacationRental JSON-LD block`);
  return vacationRentalScript;
}

function accommodationFacts(place) {
  return {
    name: place.name,
    numberOfBedrooms: place.numberOfBedrooms,
    numberOfBathroomsTotal: place.numberOfBathroomsTotal,
    occupancy: place.occupancy,
  };
}

function assertPageContract(schema, page) {
  assert.equal(typeof schema.identifier, 'string', `${page}: VacationRental identifier must be a string`);
  assert.match(schema.identifier, /\S/, `${page}: VacationRental identifier must not be empty`);
  assert.equal(
    schema.hasMap,
    'https://www.google.com/maps/search/?api=1&query=36.9932,25.0518',
    `${page}: VacationRental must expose a map URL`
  );
  assert.equal(
    schema.additionalType,
    'https://schema.org/Apartment',
    `${page}: VacationRental additionalType must stay unchanged`
  );
  assert.equal(
    schema.tourBookingPage,
    'https://seatree.gr/#contact',
    `${page}: VacationRental tourBookingPage must stay unchanged`
  );

  assert.ok(Array.isArray(schema.sameAs), `${page}: VacationRental sameAs must be an array`);
  assert.ok(
    schema.sameAs.includes('https://www.airbnb.com/rooms/1659626910469787873'),
    `${page}: VacationRental sameAs must include Airbnb`
  );
  assert.ok(
    schema.sameAs.includes('https://www.booking.com/hotel/gr/aliki-seafront-luxury-apartment.en-gb.html'),
    `${page}: VacationRental sameAs must include Booking.com`
  );

  const amenityNames = new Set(schema.amenityFeature?.map((amenity) => amenity.name));
  for (const requiredAmenity of ['wifi', 'ac', 'kitchen', 'beachAccess', 'washerDryer']) {
    assert.ok(amenityNames.has(requiredAmenity), `${page}: VacationRental amenities must include ${requiredAmenity}`);
  }

  assert.ok(Array.isArray(schema.containsPlace), `${page}: VacationRental containsPlace must be an array`);
  assert.equal(
    schema.containsPlace.length,
    EXPECTED_ACCOMMODATION_FACTS.length,
    `${page}: VacationRental containsPlace must keep the apartment and both bedrooms`
  );
  assert.ok(
    schema.containsPlace.some((place) => place.additionalType === 'EntirePlace'),
    `${page}: VacationRental containsPlace must include the entire place`
  );

  for (const expected of EXPECTED_ACCOMMODATION_FACTS) {
    const place = schema.containsPlace.find((candidate) => candidate.name === expected.name);
    assert.ok(place, `${page}: missing containsPlace "${expected.name}"`);
    assert.equal(place['@type'], 'Accommodation', `${page}: "${expected.name}" must remain Accommodation`);
    assert.deepEqual(
      accommodationFacts(place),
      expected,
      `${page}: accommodation facts for "${expected.name}" must stay on containsPlace`
    );
  }
}

export function assertVacationRentalSchemaContract() {
  const violations = [];
  const schemas = LOCALE_PAGES.map((page) => {
    const schema = extractVacationRentalSchema(page);
    const present = UNRECOGNIZED_VACATION_RENTAL_PROPERTIES.filter((property) => Object.hasOwn(schema, property));
    if (present.length > 0) {
      violations.push(`${page}: ${present.join(', ')}`);
    }
    return { page, schema };
  });

  assert.deepEqual(
    violations,
    [],
    `VacationRental must not declare numberOfBedrooms, numberOfBathroomsTotal, or occupancy.\n${violations.join('\n')}`
  );

  for (const { page, schema } of schemas) {
    assertPageContract(schema, page);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  assertVacationRentalSchemaContract();
}
