import express from 'express';

const app = express();

app.get('/product', (req, res) => {
  const { num1, num2 } = req.query;
  const product = parseInt(num1) + parseInt(num2);
  res.send(product+'');
});

app.get('/squre', (req, res) => {
  const { num } = req.query;
  const squre = parseInt(num) ** 2;
  res.send(squre+'');
});

app.listen(3000);