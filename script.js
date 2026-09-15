function calculate() {
  const income = parseFloat(document.getElementById("income").value);
  const errorEl = document.getElementById("error");
  const resultEl = document.getElementById("result");

  errorEl.textContent = "";
  resultEl.style.display = "none";

  try {
    if (!Number.isFinite(income) || income < 0) {
      throw new Error("Please enter a valid non-negative income.");
    }

    const tax = calculateTax(income);
    const net = calculateNetIncome(income);
    const rate = effectiveRate(income);

    document.getElementById("rIncome").textContent =
      income.toFixed(2);

    document.getElementById("rTax").textContent =
      tax.toFixed(2);

    document.getElementById("rNet").textContent =
      net.toFixed(2);

    document.getElementById("rRate").textContent =
      rate.toFixed(2);

    resultEl.style.display = "block";
  } catch (err) {
    errorEl.textContent = err.message;
  }
}
