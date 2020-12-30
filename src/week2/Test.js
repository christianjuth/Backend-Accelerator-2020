const express = require('express');
const bodyParser = require('body-parser');
const config = require('../../config');

// Helper Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

app.get('/random', (req, res) => {
  res.send(randomInt(1, 100)+'');
});

app.get('/sum', (req, res) => {
  const { val1, val2 } = req.query;
  const val3 = parseInt(val1) + parseInt(val2);
  res.send(val3+'');
});

const testscores = [];

app.post('/testscores', (req, res) => {
  const { score } = req.body;
  testscores.push(score);
  res.send('Added new score');
});

app.get('/testscores', (req, res) => {
  res.send(testscores.join(', '));
});

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
});

// Export app for testing
exports.app = app;