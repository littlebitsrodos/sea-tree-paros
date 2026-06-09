import { test, expect } from '@playwright/test';
import { assertDirectContactContract } from '../scripts/check_direct_contact_contract.mjs';

test.describe('Direct contact contract', () => {
  test('booking surface uses direct inquiry links without stale form or payment placeholders', () => {
    expect(() => assertDirectContactContract()).not.toThrow();
  });
});
