import { test, expect } from '@playwright/test';
import { assertPriceParityContract } from '../scripts/check_price_parity_contract.mjs';

test.describe('Price parity contract', () => {
  test('SeaTree public rates stay internally consistent', () => {
    expect(() => assertPriceParityContract()).not.toThrow();
  });
});
