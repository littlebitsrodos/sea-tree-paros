import { test, expect } from '@playwright/test';
import { assertVacationRentalSchemaContract } from '../scripts/check_vacation_rental_schema_contract.mjs';

test.describe('VacationRental schema contract', () => {
  test('identifier, occupancy, and JSON-LD CSP hashes stay valid', () => {
    expect(() => assertVacationRentalSchemaContract()).not.toThrow();
  });
});
