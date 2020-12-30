const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config');

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

let db, client;
MongoClient.connect(config.mongoUrl, { useUnifiedTopology: true }, (err, clientLocal) => {
  if (err) {
    console.error(err);
  }
  client = clientLocal;
  db = client.db();
  app.emit("mongoConnected")
});


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

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
});


app.on('mongoConnected', function() { 
  app.listen(config.port, () => {
    console.log(`App listening at http://localhost:${config.port}`)
  });
});
app.on('close', function() {
  if (client) {
    client.close();
  }
});


// Export app for testing
exports.app = app;