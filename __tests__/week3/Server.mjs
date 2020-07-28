import request from 'supertest';
import { app } from '../../week3/Server';
import "babel-polyfill"

describe('week3 Server', () => {

  it('GET/POST /restaurants', async (done) => {
    const initialRes = await request(app).get('/restaurants');
    expect(initialRes.statusCode).toBe(200);
    expect(initialRes.text).toBe('[]');

    const RESTAURANT = {
      name: 'Brower',
      address: 'College Ave'
    };

    const postRes = await request(app)
      .post('/restaurants')
      .send(RESTAURANT);
    expect(postRes.statusCode).toBe(200);
    expect(postRes.text).toBe('Success Added new restaurant');

    const getRes = await request(app)
      .get('/restaurants');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text)[0]).toMatchObject(RESTAURANT);

    done();
  });

  it('GET/POST /restaurants/:resName/items', async (done) => {
    const initialRes = await request(app).post('/restaurants/test/items');
    expect(initialRes.statusCode).toBe(404);
    expect(initialRes.text).toBe('Error restaurant does not exist');

    const ITEM = {
      itemName: 'Bread',
      itemDescription: 'Yum',
      itemPrice: '$10'
    };

    const postRes = await request(app)
      .post('/restaurants/Brower/items')
      .send(ITEM);
    expect(postRes.statusCode).toBe(200);
    expect(postRes.text).toBe(`Success new item added to menu of Brower`);

    const getRes = await request(app)
      .get('/restaurants/Brower/items');
    expect(getRes.statusCode).toBe(200);
    expect(JSON.parse(getRes.text)[0]).toMatchObject(ITEM);

    const overwritePost = await request(app)
      .post('/restaurants/Brower/items')
      .send(ITEM);
    expect(overwritePost.statusCode).toBe(409);
    expect(overwritePost.text).toBe('Error item exists already');

    done();
  });

});
