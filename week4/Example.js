const express = require('express');
const bodyParser = require('body-parser');

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

app.listen(3000);

// Export app for testing
exports.app = app;