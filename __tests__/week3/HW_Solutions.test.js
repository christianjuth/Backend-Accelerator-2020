const request = require('supertest');
const { app } = require('../../src/week3/HW_Solutions');

const TEST_RESTAURANT = 'Brower';
const TEST_RESTAURANT_2 = "Henry's Diner";
const TEST_RESTAURANT_NOT_FOUND = "this does not exsist";

describe('week3 HW_Solutions', () => {

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
    const notFound = await request(app).post(`/restaurants/${TEST_RESTAURANT_NOT_FOUND}/items`);
    expect(notFound.statusCode).toBe(404);
    expect(notFound.text).toBe('Error restaurant does not exist');
    
    // Items should initially be empty
    const initialValue = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(initialValue.statusCode).toBe(200);
    expect(initialValue.text).toBe('[]');

    const ITEM1 = {
      itemName: 'Bread',
      itemDescription: 'Yum',
      itemPrice: '$5'
    };
    
    const ITEM2 = {
      itemName: 'Apple',
      itemDescription: 'Healthy',
      itemPrice: '$1'
    };

    // Add item one to restaurant menu
    const addItem1 = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/items`)
      .send(ITEM1);
    expect(addItem1.statusCode).toBe(200);
    expect(addItem1.text).toBe(`Success new item added to menu of ${TEST_RESTAURANT}`);

    // Verify item one was added to manu
    const verifyItem1 = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(verifyItem1.statusCode).toBe(200);
    expect(JSON.parse(verifyItem1.text)).toMatchObject([ITEM1]);
    
    // Try and overwrite item one
    const overwriteItem = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/items`)
      .send(ITEM1);
    expect(overwriteItem.statusCode).toBe(409);
    expect(overwriteItem.text).toBe('Error item exists already');
    
    // Add item two to restaurant menu
    const addItem2 = await request(app)
      .post(`/restaurants/${TEST_RESTAURANT}/items`)
      .send(ITEM2);
    expect(addItem2.statusCode).toBe(200);
    expect(addItem2.text).toBe(`Success new item added to menu of ${TEST_RESTAURANT}`);

    // Verify items one and two are on restaurant manu
    const verifyItems = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(verifyItems.statusCode).toBe(200);
    expect(JSON.parse(verifyItems.text)).toMatchObject([ITEM1, ITEM2]);

    done();
  });

  it('GET/POST /restaurants/:resName/reviews', async (done) => {
    // Verify restaurant 404
    const initialRes = await request(app).post(`/restaurants/${TEST_RESTAURANT_NOT_FOUND}/reviews`);
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
