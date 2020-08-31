const request = require('supertest');
const { app } = require('../../week4/Example');

const TEST_RESTAURANT = 'Brower';
const TEST_RESTAURANT_2 = "Henry's Diner";
const TEST_RESTAURANT_NOT_FOUND = "this does not exsist";

describe('week4 Example', () => {

  it('GET/POST /restaurants', async (done) => {
    // Verify that restaurant is initially empty
    const initialRes = await request(app).get('/restaurants');
    expect(initialRes.statusCode).toBe(200);
    expect(initialRes.text).toBe('[]');

    const RESTAURANT1 = {
      name: TEST_RESTAURANT,
      address: 'College Ave'
    };
    
    const RESTAURANT2 = {
      name: TEST_RESTAURANT_2,
      address: 'Livi'
    };
    
    // Add restaurant one
    const addRes1 = await request(app)
      .post('/restaurants')
      .send(RESTAURANT1);
    expect(addRes1.statusCode).toBe(200);
    expect(addRes1.text).toBe('Success Added new restaurant');

    // Verify add restaurant one
    const verifyRes1 = await request(app)
      .get('/restaurants');
    expect(verifyRes1.statusCode).toBe(200);
    expect(JSON.parse(verifyRes1.text)).toMatchObject([RESTAURANT1]);
    
    // Try and overwrite restaurant
    const overwrite = await request(app)
      .post('/restaurants')
      .send(RESTAURANT1);
    expect(overwrite.statusCode).toBe(409);
    expect(overwrite.text).toBe('Error restaurant exists already');
    
    // Add restaurant two
    const addRes2 = await request(app)
      .post('/restaurants')
      .send(RESTAURANT2);
    expect(addRes2.statusCode).toBe(200);
    expect(addRes2.text).toBe('Success Added new restaurant');

    // Verify add restaurant two
    const verifyRes2 = await request(app)
      .get('/restaurants');
    expect(verifyRes2.statusCode).toBe(200);
    expect(JSON.parse(verifyRes2.text)).toMatchObject([RESTAURANT1, RESTAURANT2]);

    done();
  });

  it('GET/POST /restaurants/:resName/items', async (done) => {
    // Verify restaurant 404
    const notFound = await request(app).post('/restaurants/test/items');
    expect(notFound.statusCode).toBe(404);
    expect(notFound.text).toBe('Error restaurant does not exist');
    
    // Items should initially be empty
    const initialValue = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(initialValue.statusCode).toBe(200);
    expect(initialValue.text).toBe('[]');

    const ITEM = {
      itemName: 'Bread',
      itemDescription: 'Yum',
      itemPrice: '$10'
    };

    // Add item to restaurant menu
    const addResItem = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/items`)
      .send(ITEM);
    expect(addResItem.statusCode).toBe(200);
    expect(addResItem.text).toBe(`Success new item added to menu of ${TEST_RESTAURANT}`);

    // Verify item was added to manu
    const verifyAdd = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(verifyAdd.statusCode).toBe(200);
    expect(JSON.parse(verifyAdd.text)[0]).toMatchObject(ITEM);

    // Try and overwrite item
    const overwriteItem = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/items`)
      .send(ITEM);
    expect(overwriteItem.statusCode).toBe(409);
    expect(overwriteItem.text).toBe('Error item exists already');

    done();
  });

  it('PUT/DELETE /restaurants/:resName', async (done) => {
    const RESTAURANT = {
      name: TEST_RESTAURANT,
      address: 'Busch'
    };

    // Update Restaurant
    const postRes = await request(app)
      .put(`/restaurants/${RESTAURANT.name}`)
      .send(RESTAURANT);
    //expect(postRes.statusCode).toBe(200);
    expect(postRes.text).toBe(`${RESTAURANT.name} updated, success!`);

    // Verify update
    const getRes = await request(app)
      .get('/restaurants');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text)[0]).toMatchObject(RESTAURANT);
    
    // Delete restaurant
    const deleteRes = await request(app)
      .delete(`/restaurants/${RESTAURANT.name}`);
    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.text).toBe(`Successfully deleted ${RESTAURANT.name}`);
    
    // Delete not found
    const deleteResError = await request(app)
      .delete(`/restaurants/${RESTAURANT.name}`);
    expect(deleteResError.statusCode).toBe(404);
    expect(deleteResError.text).toBe(`Unable to delete ${RESTAURANT.name}`);

    // Verify cleanup
    const verifyCleanup = await request(app)
      .get(`/restaurants/${RESTAURANT.name}/items`);
    expect(verifyCleanup.statusCode).toBe(404);
    expect(verifyCleanup.text).toBe('Error restaurant does not exist');

    done();
  });

});
