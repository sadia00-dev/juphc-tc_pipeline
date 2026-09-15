const express = require('express');
const path = require('path');
const { calculateTax, calculateNetIncome, effectiveRate } = require('./taxCalculator');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check - handy for Docker / Kubernetes / IBM Cloud liveness checks
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

// API: POST /api/calculate  { "income": 55000 }
app.post('/api/calculate', (req, res) => {
  try {
    const income = Number(req.body.income);
    const tax = calculateTax(income);
    const net = calculateNetIncome(income);
    const rate = effectiveRate(income);
    res.json({ income, tax, net, effectiveRatePercent: rate });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Tax Calculator app listening on port ${PORT}`);
});

module.exports = app;
