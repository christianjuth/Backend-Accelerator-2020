const request = require('supertest');
const { app } = require('../../week2/HW_Solution');

describe('week2 HW_Solution', () => {

  it('GET /product', async (done) => {
    const NUM1 = 20;
    const NUM2 = 5;

    const res = await request(app)
      .get('/product')
      .query({
        num1: NUM1,
        num2: NUM2
      });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe((NUM1 * NUM2) + '');
    done();
  });

  it('GET /square', async (done) => {
    const NUM = 4;

    const res = await request(app)
      .get('/square')
      .query({
        num: NUM
      });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe((NUM ** 2) + '');
    done();
  });

  it('GET/POST /books', async (done) => {
    const BOOK1 = 'The Hunger Games';
    const BOOK2 = 'Animal Farm';

    // Add first book
    const postRes1 = await request(app)
      .post('/books')
      .send({
        bookName: BOOK1
      });
    expect(postRes1.statusCode).toBe(200);
    expect(postRes1.text).toBe(`Added book: ${BOOK1}`);

    const getRes1 = await request(app)
      .get('/books');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.text).toBe(BOOK1);

    // Add second book
    const postRes2 = await request(app)
      .post('/books')
      .send({
        bookName: BOOK2
      });
    expect(postRes2.statusCode).toBe(200);
    expect(postRes2.text).toBe(`Added book: ${BOOK2}`);

    const getRes2 = await request(app)
      .get('/books');
    expect(getRes2.statusCode).toBe(200);
    expect(getRes2.text).toBe(`${BOOK1}, ${BOOK2}`);

    done();
  });

});

