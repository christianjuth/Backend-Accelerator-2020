const request = require('supertest');
const { app } = require('../../week1/firstserver');

describe('week1 firstserver', () => {

  it('GET /hello_world', async (done) => {
    const res = await request(app).get('/hello_world');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
    done();
  });

});

