import { test, expect } from '@playwright/test';
import { assertVacationRentalSchemaContract } from '../scripts/check_vacation_rental_schema_contract.mjs';

test.describe('VacationRental schema contract', () => {
  test('bedroom, bathroom, and occupancy stay on Accommodation, not VacationRental', () => {
    expect(() => assertVacationRentalSchemaContract()).not.toThrow();
  });
});
