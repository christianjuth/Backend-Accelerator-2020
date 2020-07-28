const express = require('express');
const bodyParser = require('body-parser');
const config = require('../../config');

// Express App
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.raw());

let restaurantList = [];
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


app.put('/restaurants/:resName', (req, res) => {
  const { resName } = req.params; 
  const { name, address } = req.body;
  
  const index = restaurantList.findIndex(r => r.name === resName);
  
  if (index >= 0) {
    restaurantList[index] = {
      name,
      address
    };
    res.send(`${resName} updated, success!`);
    return;
  }
  
  res.send(`${resName} restaurant not found!`);
});


app.delete('/restaurants/:resName', (req, res) => {
  const { resName } = req.params; 
  
  const updatedRestaurantList = restaurantList.filter(r => r.name !== resName);
  
  if (updatedRestaurantList.length < restaurantList.length) {
    // save our change
    restaurantList = updatedRestaurantList;

    // perform additional cleanup
    delete menuItems[resName];
    delete reviews[resName];

    res.status(200).send(`Successfully deleted ${resName}`);
    return;
  }
  
  res.status(404).send(`Unable to delete ${resName}`);
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

app.put('/restaurants/:resName/items/:itemName', (req, res) => {
  const { resName, itemName } = req.params;
  const { itemDescription, itemPrice } = req.body;

  if (!menuItems[resName]) {
    res.status(404).send(`error: restaurant ${resName} does not exist`)
    return;
  }

  const index = menuItems[resName].findIndex(r => r.itemName === itemName);
  
  if (index >= 0) {
    menuItems[resName][index] = {
      itemName, 
      itemResName: resName, 
      itemDescription, 
      itemPrice
    };
    res.send(`Success, updated restaurant menu ${itemName}`);
    return;
  }
  
  res.status(404).send(`Cannot find item ${itemName} in restaurant ${resName}`);
});

app.delete('/restaurants/:resName/items/:itemName', (req, res) => {
  const { resName, itemName } = req.params;

  if (!menuItems[resName]) {
    res.status(404).send(`error: restaurant ${resName} does not exist`)
    return;
  }

  const newMenu = menuItems[resName].filter(item => item.itemName !== itemName);

  if (newMenu.length < menuItems[resName].length) {
    menuItems[resName] = newMenu;
    res.send(`Successfully deleted ${itemName}`);
    return;
  } 
  
  res.status(404).send("Unable to delete item");
});

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

app.put('/restaurants/:resName/reviews/:reviewUsername', (req, res) => {
  const { resName, reviewUsername } = req.params;
  const { reviewStars, reviewComment } = req.body;
  
  if (reviews[resName] === undefined) {
    res.status(404).send(`error: restaurant ${resName} does not exist`);
    return;
  }

  const index = reviews[resName].findIndex(r => r.reviewUsername === reviewUsername);

  if (index >= 0) {
    reviews[resName][index] = {
      reviewUsername, 
      itemResName: resName, 
      reviewStars, 
      reviewComment
    };
    res.send(`Success, updated restaurant review from ${reviewUsername}`);
    return;
  }
  
  res.status(404).send(`Cannot find ${reviewUsername}'s review in restaurant ${resName}`);
});

app.delete('/restaurants/:resName/reviews/:reviewUsername', (req, res) => {
  const { resName, reviewUsername } = req.params;
  
  if (reviews[resName] === undefined) {
    res.status(404).send(`error: restaurant ${resName} does not exist`);
    return;
  }

  const newReviews = reviews[resName].filter(r => r.reviewUsername !== reviewUsername);

  if (newReviews.length < reviews[resName].length) {
    reviews[resName] = newReviews;
    res.send(`Successfully deleted review from ${reviewUsername}`);
    return;
  } 
  
  res.status(404).send("Unable to delete item");
});


app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
});

// Export app for testing
exports.app = app;