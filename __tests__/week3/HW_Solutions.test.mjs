import request from 'supertest';
import { app } from '../../week3/HW_Solutions';
import "babel-polyfill";

const TEST_RESTAURANT = 'Brower';
const TEST_RESTAURANT_2 = "Henry's Diner";

describe('week3 HW_Solutions', () => {

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

  it('GET/POST /restaurants/:resName/reviews', async (done) => {
    // Verify restaurant 404
    const initialRes = await request(app).post('/restaurants/test/reviews');
    expect(initialRes.statusCode).toBe(404);
    expect(initialRes.text).toBe('Error restaurant does not exist');

    const REVIEW1 = {
      reviewUsername: 'busch-goose',
      reviewStars: 4,
      reviewComment: 'fight me'
    };
    
    const REVIEW2 = {
      reviewUsername: 'snipp',
      reviewStars: 5,
      reviewComment: 'I shall save thee'
    };

    // Add review to restaurant
    const addReview = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/reviews`)
      .send(REVIEW1);
    expect(addReview.statusCode).toBe(200);
    expect(addReview.text).toBe(`Success new comment has been added to review section of ${TEST_RESTAURANT}`);
    
    // Verify first review
    const verifyAdd2 = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/reviews`);
    expect(verifyAdd2.statusCode).toBe(200);
    expect(JSON.parse(verifyAdd2.text)).toMatchObject([REVIEW1]);
    
    // Add second review
    const addReview2 = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/reviews`)
      .send(REVIEW2);
    expect(addReview2.statusCode).toBe(200);
    expect(addReview2.text).toBe(`Success new comment has been added to review section of ${TEST_RESTAURANT}`);

    // Verify first and second review
    const verifyAdd = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/reviews`);
    expect(verifyAdd.statusCode).toBe(200);
    expect(JSON.parse(verifyAdd.text)).toMatchObject([REVIEW1, REVIEW2]);

    // Try and overwrite
    const overwritePost = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/reviews`)
      .send(REVIEW1);
    expect(overwritePost.statusCode).toBe(409);
    expect(overwritePost.text).toBe('Error you have already written a review');

    done();
  });

});
