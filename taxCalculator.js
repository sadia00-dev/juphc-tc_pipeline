/**
 * Core business logic for the Tax Calculator app.
 * Works in both Node/Jasmine and the browser.
 */

const BRACKETS = [
  { upTo: 10000, rate: 0.0 },
  { upTo: 40000, rate: 0.10 },
  { upTo: 85000, rate: 0.20 },
  { upTo: Infinity, rate: 0.30 }
];

function calculateTax(income) {
  if (typeof income !== "number" || Number.isNaN(income)) {
    throw new Error("Income must be a valid number");
  }

  if (income < 0) {
    throw new Error("Income cannot be negative");
  }

  let tax = 0;
  let lowerBound = 0;

  for (const bracket of BRACKETS) {
    if (income > lowerBound) {
      const taxableAtThisRate =
        Math.min(income, bracket.upTo) - lowerBound;

      tax += taxableAtThisRate * bracket.rate;
      lowerBound = bracket.upTo;
    } else {
      break;
    }
  }

  return Math.round(tax * 100) / 100;
}

function calculateNetIncome(income) {
  const tax = calculateTax(income);
  return Math.round((income - tax) * 100) / 100;
}

function effectiveRate(income) {
  if (income === 0) {
    return 0;
  }

  const tax = calculateTax(income);
  return Math.round((tax / income) * 10000) / 100;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateTax,
    calculateNetIncome,
    effectiveRate,
    BRACKETS
  };
}

if (typeof window !== "undefined") {
  window.calculateTax = calculateTax;
  window.calculateNetIncome = calculateNetIncome;
  window.effectiveRate = effectiveRate;
}
