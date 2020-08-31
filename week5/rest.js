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

  app.post('/restaurants', async (req, res) => {
    const { name, address } = req.body;

    const restaurantCollection = db.collection('restaurants');
  
    if (await restaurantCollection.findOne({ name })) {
      res.status(409).send('Error restaurant exists already');
      return;
    }
  
    restaurantCollection.insertOne({
      name, 
      address
    });
    res.send('Success Added new restaurant');
  });
  
  app.get('/restaurants', async (req, res) => {
    const restaurantCollection = db.collection('restaurants');
    res.json(await restaurantCollection.find({}).toArray());
  });

  app.listen(3000);

});

// Export app for testing
exports.app = app;