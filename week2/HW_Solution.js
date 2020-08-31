const express = require('express');
const bodyParser = require('body-parser');

// Express App
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/product', (req, res) => {
  const { num1, num2 } = req.query;
  const product = parseInt(num1) * parseInt(num2);
  res.send(product+'');
});

app.get('/square', (req, res) => {
  const { num } = req.query;
  const squre = parseInt(num) ** 2;
  res.send(squre+'');
});

const listOfBooks = [];

app.post('/books', (req, res) => {
  const { bookName } = req.body;
  listOfBooks.push(bookName);
  res.send(`Added book: ${bookName}`);
});

app.get('/books', (req, res) => {
  res.send(listOfBooks.join(', '));
});

app.listen(3000);

// Export app for testing
exports.app = app;