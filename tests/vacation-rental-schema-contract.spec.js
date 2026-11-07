import { test, expect } from '@playwright/test';
import { assertVacationRentalSchemaContract } from '../scripts/check_vacation_rental_schema_contract.mjs';

test.describe('VacationRental schema contract', () => {
  test('bedroom and bathroom facts stay on Accommodation and JSON-LD CSP hashes match', () => {
    expect(() => assertVacationRentalSchemaContract()).not.toThrow();
  });
});
