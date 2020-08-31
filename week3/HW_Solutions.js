const express = require('express');
const bodyParser = require('body-parser');

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

const restaurantList = [];
const menuItems = {};
const reviews = {};

app.post('/restaurants', (req, res) => {
  const { name, address } = req.body;

  if (restaurantList.find(restaurant => restaurant.name === name) ) {
    res.status(409).send('Error restaurant exists already');
    return;
  }

  restaurantList.push({
    name, 
    address
  });
  menuItems[name] = [];
  reviews[name] = [];

  res.send('Success Added new restaurant');
});

app.get('/restaurants', (req, res) => {
  res.send(restaurantList);
});

app.post('/restaurants/:resName/items', (req, res) => {
  const { resName } = req.params; 
  const { itemName, itemDescription, itemPrice } = req.body;

  if (menuItems[resName] === undefined) {
    res.status(404).send("Error restaurant does not exist");
    return;
  }

  for (const tempItem of menuItems[resName]) {
    if (tempItem.itemName === itemName) {
      res.status(409).send("Error item exists already");
      return;
    }
  }

  menuItems[resName].push({
    itemName, 
    itemResName: resName, 
    itemDescription, 
    itemPrice
  });
  res.send(`Success new item added to menu of ${resName}`);
  
});

app.get('/restaurants/:resName/items', (req, res) => {
  const { resName } = req.params;

  if (menuItems[resName] === undefined) {
    res.status(404).send("Error restaurant does not exist");
    return;
  }

  res.send(menuItems[resName]);
});

// HOMEOWRK STARTING FROM HERE

app.post('/restaurants/:resName/reviews', (req, res) => {
  const { resName } = req.params; 
  const { reviewUsername, reviewStars, reviewComment } = req.body;

  if (reviews[resName] === undefined) {
    res.status(404).send("Error restaurant does not exist");
    return;
  }

  for (const r of reviews[resName]) {
    if (r.reviewUsername === reviewUsername) {
      res.status(409).send("Error you have already written a review");
      return;
    }
  }

  reviews[resName].push({
    reviewUsername, 
    itemResName: resName, 
    reviewStars, 
    reviewComment
  });
  res.send(`Success new comment has been added to review section of ${resName}`);

});

app.get('/restaurants/:resName/reviews', (req, res) => {
  const { resName } = req.params;
  const { limit } = req.query;
  
  if (reviews[resName] === undefined) {
    res.status(404).send("Error restaurant does not exist");
    return;
  }

  let items = reviews[resName];
  if (limit) {
    items = items.slice(0, limit)
  }
  res.send(items);
});

app.listen(3000);

// Export app for testing
exports.app = app;