const request = require('supertest');
const { app } = require('../../src/week5/hw5');

const TEST_RESTAURANT = 'Brower';
const TEST_RESTAURANT_2 = "Henry's Diner";
const TEST_RESTAURANT_NOT_FOUND = "this does not exsist";

describe('week5 Example', () => {

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

    // Update the item
    const UPDATED_ITEM = {
      ...ITEM,
      itemPrice: '$5'
    };

    const updatedResItem = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT}/items/${UPDATED_ITEM.itemName}`)
      .send(UPDATED_ITEM);
    expect(updatedResItem.statusCode).toBe(200);
    expect(updatedResItem.text).toBe(`Success, updated restaurant menu ${UPDATED_ITEM.itemName}`);

    // Verify item was updated
    const verifyUpdate = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/items`);
    expect(verifyUpdate.statusCode).toBe(200);
    expect(JSON.parse(verifyUpdate.text)[0]).toMatchObject(UPDATED_ITEM);

    // Try and update non exsistent item
    const FAKE_ITEM = {
      itemName: 'fakeItem'
    }

    const updateShouldFailRes = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT}/items/${FAKE_ITEM.itemName}`)
      .send(UPDATED_ITEM);
    expect(updateShouldFailRes.statusCode).toBe(404);
    expect(updateShouldFailRes.text).toBe(`Cannot find item ${FAKE_ITEM.itemName} in restaurant ${TEST_RESTAURANT}`);

    // Try and update item from restaurant that doesn't exsist 
    const updateShouldFailRes2 = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT_NOT_FOUND}/items/${UPDATED_ITEM.itemName}`);
    expect(updateShouldFailRes2.statusCode).toBe(404);
    expect(updateShouldFailRes2.text).toBe(`error: restaurant ${TEST_RESTAURANT_NOT_FOUND} does not exist`);

    // Try and delete item from restaurant that doesn't exsist
    const shouldFailDeleteRes = await request(app)
      .delete(`/restaurants/${TEST_RESTAURANT_NOT_FOUND}/items/${UPDATED_ITEM.itemName}`);
    expect(shouldFailDeleteRes.statusCode).toBe(404);
    expect(shouldFailDeleteRes.text).toBe(`error: restaurant ${TEST_RESTAURANT_NOT_FOUND} does not exist`);

    // Delete item
    const deletedResItem = await request(app)
      .delete(`/restaurants/${TEST_RESTAURANT}/items/${UPDATED_ITEM.itemName}`);
    expect(deletedResItem.statusCode).toBe(200);
    expect(deletedResItem.text).toBe(`Successfully deleted ${UPDATED_ITEM.itemName}`);

    // Try and delete already deleted item
    const shouldFailDeleteRes2 = await request(app)
      .delete(`/restaurants/${TEST_RESTAURANT}/items/${UPDATED_ITEM.itemName}`);
    expect(shouldFailDeleteRes2.statusCode).toBe(404);
    expect(shouldFailDeleteRes2.text).toBe('Unable to delete item');

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

    // Update review
    const UPDATED_REVIEW2 = {
      ...REVIEW2,
      reviewStars: 1,
      reviewComment: "Y'all are on your own"
    };

    const updatedReview2Res = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT}/reviews/${UPDATED_REVIEW2.reviewUsername}`)
      .send(UPDATED_REVIEW2);
    expect(updatedReview2Res.statusCode).toBe(200);
    expect(updatedReview2Res.text).toBe(`Success, updated restaurant review from ${UPDATED_REVIEW2.reviewUsername}`);

    // Verify update
    const verifyUpdate = await request(app)
      .get(`/restaurants/${TEST_RESTAURANT}/reviews`);
    expect(verifyUpdate.statusCode).toBe(200);
    expect(JSON.parse(verifyUpdate.text)).toMatchObject([REVIEW1, UPDATED_REVIEW2]);

    // Try and update non exsistent review
    const FAKE_REVIEW = {
      reviewUsername: 'iamfake'
    }

    const shouldFailUpdate1Res = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT}/reviews/${FAKE_REVIEW.reviewUsername}`)
      .send(FAKE_REVIEW);
    expect(shouldFailUpdate1Res.statusCode).toBe(404);
    expect(shouldFailUpdate1Res.text).toBe(`Cannot find ${FAKE_REVIEW.reviewUsername}'s review in restaurant Brower`);

    // Try and update review in non exsistent restaurant
    const shouldFailUpdate2Res = await request(app)
      .put(`/restaurants/${TEST_RESTAURANT_NOT_FOUND}/reviews/${UPDATED_REVIEW2.reviewUsername}`)
      .send(UPDATED_REVIEW2);
    expect(shouldFailUpdate2Res.statusCode).toBe(404);
    expect(shouldFailUpdate2Res.text).toBe('error: restaurant this does not exsist does not exist');

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
    const verifyCleanup1 = await request(app)
      .get(`/restaurants/${RESTAURANT.name}/reviews`);
    expect(verifyCleanup1.statusCode).toBe(404);
    expect(verifyCleanup1.text).toBe('Error restaurant does not exist');

    const verifyCleanup2 = await request(app)
      .get(`/restaurants/${RESTAURANT.name}/items`);
    expect(verifyCleanup2.statusCode).toBe(404);
    expect(verifyCleanup2.text).toBe('Error restaurant does not exist');

    done();
  });

});
