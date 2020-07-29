import request from 'supertest';
import { app } from '../../week4/Example';
import "babel-polyfill";

const TEST_RESTAURANT = 'Brower;'

describe('week4 Example', () => {

  it('GET/POST /restaurants', async (done) => {
    // Verify that restaurant is initially empty
    const initialRes = await request(app).get('/restaurants');
    expect(initialRes.statusCode).toBe(200);
    expect(initialRes.text).toBe('[]');

    const RESTAURANT = {
      name: TEST_RESTAURANT,
      address: 'College Ave'
    };
    
    // Add restaurant
    const postRes = await request(app)
      .post('/restaurants')
      .send(RESTAURANT);
    expect(postRes.statusCode).toBe(200);
    expect(postRes.text).toBe('Success Added new restaurant');

    // Verify add
    const getRes = await request(app)
      .get('/restaurants');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text)[0]).toMatchObject(RESTAURANT);

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

});
