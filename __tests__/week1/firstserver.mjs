import request from 'supertest';
import { app } from '../../week1/firstserver';
import "babel-polyfill"

describe('firstserver', () => {

  it('GET /hello_world', async (done) => {
    const res = await request(app).get('/hello_world');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Hello World');
    done();
  });

});

