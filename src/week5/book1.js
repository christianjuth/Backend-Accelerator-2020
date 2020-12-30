const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

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

  app.get('/books', async (req, res) => {
    const { title } = req.body;

    const bookCollection = db.collection('books');

    if (!title) {
      res.json(await bookCollection.find({}).toArray());
      return;
    }

    else {
      const book = await bookCollection.findOne({ title });
      if (book) {
        res.json(book);
        return;
      }
    }

    res.send('book cannot be found');
  });

  app.listen(config.port, () => {
    console.log(`App listening at http://localhost:${config.port}`)
  });

});

// Export app for testing
exports.app = app;