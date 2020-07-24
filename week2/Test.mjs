import express from 'express';
import bodyParser from 'body-parser';

// Helper Functions
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

// Express App
export const app = express();
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
  const score = req.body.score;
  testscores.push(score);
  res.send('Added new score');
});

app.get('/testscores', (req, res) => {
  res.send(testscores.join(', '));
});

app.listen(3000);