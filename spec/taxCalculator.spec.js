const { calculateTax, calculateNetIncome, effectiveRate } = require('../taxCalculator');

describe('Tax Calculator', () => {

  it('charges 0% tax for income within the first bracket', () => {
    expect(calculateTax(5000)).toBe(0);
  });

  it('charges 10% tax for income in the second bracket', () => {
    // (25000 - 10000) * 0.10 = 1500
    expect(calculateTax(25000)).toBe(1500);
  });

  it('charges progressive tax across multiple brackets', () => {
    // 0-10000 @0% = 0
    // 10000-40000 @10% = 3000
    // 40000-55000 @20% = 3000
    // total = 6000
    expect(calculateTax(55000)).toBe(6000);
  });

  it('charges the top rate for high income', () => {
    // 0-10000 @0 = 0
    // 10000-40000 @10% = 3000
    // 40000-85000 @20% = 9000
    // 85000-100000 @30% = 4500
    // total = 16500
    expect(calculateTax(100000)).toBe(16500);
  });

  it('calculates net income correctly', () => {
    expect(calculateNetIncome(55000)).toBe(49000);
  });

  it('calculates the effective tax rate as a percentage', () => {
    expect(effectiveRate(55000)).toBeCloseTo(10.91, 1);
  });

  it('returns 0 effective rate for 0 income', () => {
    expect(effectiveRate(0)).toBe(0);
  });

  it('throws an error for negative income', () => {
    expect(() => calculateTax(-100)).toThrowError('Income cannot be negative');
  });

  it('throws an error for non-numeric income', () => {
    expect(() => calculateTax('abc')).toThrowError('Income must be a valid number');
  });

});
