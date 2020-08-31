const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error(err);
  }

  const db = client.db();

  app.post('/books', async (req, res) => {
    const { title, author } = req.body;

    const bookCollection = db.collection('books');

    if (await bookCollection.findOne({ title })) {
      res.status(409).send('Book already inserted');
      return;
    }

    bookCollection.insertOne({
      title,
      author
    });
    res.send('Book successfully inserted');
  });

  app.listen(3000);

});

// Export app for testing
exports.app = app;