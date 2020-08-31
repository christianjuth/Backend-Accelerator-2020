const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

MongoClient.connect('mongodb+srv://christianjuth:cfHZQneznRETF4mcubEsWacZi@cluster0.53mpy.mongodb.net/rumad?retryWrites=true&w=majority' ?? 'mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
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
      address,
      menuItems: [],
      reviews: []
    });
    res.send('Success Added new restaurant');
  });
  
  app.get('/restaurants', async (req, res) => {
    const restaurantCollection = db.collection('restaurants');
    res.json(await restaurantCollection.find({}).toArray());
  });

  app.post('/restaurants/:resId/items', async (req, res) => {
    const { resId } = req.params; 
    const { itemName, itemDescription, itemPrice } = req.body;

    const restaurantCollection = db.collection('restaurants');

    let restaurant; 
    try {
      restaurant = await restaurantCollection.findOne({ '_id': ObjectID(resId) });
    } catch(err) {}
  
    if (!restaurant) {
      res.status(404).send("Error restaurant does not exist");
      return;
    }
  
    for (const tempItem of restaurant.menuItems) {
      if (tempItem.itemName === itemName) {
        res.status(409).send("Error item exists already");
        return;
      }
    }

    if ([itemName, itemDescription, itemPrice].includes(undefined)) {
      res.status(400).send("itemName, itemDescription, itemPrice are all required");
      return;
    }

    restaurantCollection.updateOne(
      { '_id': ObjectID(resId) },
      {
        '$push': {
          menuItems: {
            itemName, 
            itemDescription, 
            itemPrice
          }
        }
      }
    );
  
    res.send(`Success new item added to menu of ${restaurant.name}`);
  });
  
  app.get('/restaurants/:resId/items', async (req, res) => {
    const { resId } = req.params;

    const restaurantCollection = db.collection('restaurants');

    let restaurant; 
    try {
      restaurant = await restaurantCollection.findOne({ '_id': ObjectID(resId) });
    } catch(err) {}
  
    if (!restaurant) {
      res.status(404).send("Error restaurant does not exist");
      return;
    }
  
    res.json(restaurant.menuItems);
  });

  app.post('/restaurants/:resId/reviews', async (req, res) => {
    const { resId } = req.params; 
    const { reviewUsername, reviewStars, reviewComment } = req.body;

    const restaurantCollection = db.collection('restaurants');

    let restaurant; 
    try {
      restaurant = await restaurantCollection.findOne({ '_id': ObjectID(resId) });
    } catch(err) {}
  
    if (!restaurant) {
      res.status(404).send("Error restaurant does not exist");
      return;
    }
  
    for (const r of restaurant.reviews) {
      if (r.reviewUsername === reviewUsername) {
        res.status(409).send("Error you have already written a review");
        return;
      }
    }

    if ([reviewUsername, reviewStars, reviewComment].includes(undefined)) {
      res.status(400).send("reviewUsername, reviewStars, reviewComment are all required");
      return;
    }

    const computedStarts = +reviewStars; // cast to number

    if (computedStarts < 0 || computedStarts > 5) {
      res.status(400).send('reviewStars must be between 0 and 5');
      return;
    }

    restaurantCollection.updateOne(
      { '_id': ObjectID(resId) },
      {
        '$push': {
          reviews: {
            reviewUsername, 
            reviewStars, 
            reviewComment
          }
        }
      }
    );
  
    res.send(`Success new comment has been added to review section of ${restaurant.name}`);
  });
  
  app.get('/restaurants/:resId/reviews', async (req, res) => {
    const { resId } = req.params;

    const restaurantCollection = db.collection('restaurants');

    let restaurant; 
    try {
      restaurant = await restaurantCollection.findOne({ '_id': ObjectID(resId) });
    } catch(err) {}
  
    if (!restaurant) {
      res.status(404).send("Error restaurant does not exist");
      return;
    }
  
    res.json(restaurant.reviews);
  });

  app.listen(3000);

});

// Export app for testing
exports.app = app;