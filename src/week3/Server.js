const express = require('express');
const bodyParser = require('body-parser');
const config = require('../../config');

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

app.listen(config.port, () => {
  console.log(`App listening at http://localhost:${config.port}`)
});

// Export app for testing
exports.app = app;