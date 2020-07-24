import request from 'supertest';
import { app } from '../../week2/Test';
import "babel-polyfill"

describe('Test', () => {

  it('GET /sum', async (done) => {
    const res = await request(app)
      .get('/sum')
      .query({
        val1: '10',
        val2: '10'
      });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('20');
    done();
  });

  it('GET /random', async (done) => {
    const res = await request(app)
      .get('/random');
    expect(res.statusCode).toBe(200);

    const int = parseInt(res.text);
    expect(int).toBeGreaterThanOrEqual(1);
    expect(int).toBeLessThanOrEqual(100);
    done();
  });

  it('GET/POST /testscores', async (done) => {
    const postRes = await request(app)
      .post('/testscores')
      .send({
        score: '50%'
      });
    expect(postRes.statusCode).toBe(200);
    expect(postRes.text).toBe('Added new score');

    const getRes = await request(app)
      .get('/testscores');
    expect(getRes.statusCode).toBe(200);
    expect(getRes.text).toBe('50%');
    done();
  });

});

