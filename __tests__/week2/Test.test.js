const request = require('supertest');
const { app } = require('../../src/week2/Test');

describe('wee2 Test', () => {

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
    const SCORE1 = '50%';
    const SCORE2 = '75%';

    // first score
    const postRes1 = await request(app)
      .post('/testscores')
      .send({
        score: SCORE1
      });
    expect(postRes1.statusCode).toBe(200);
    expect(postRes1.text).toBe('Added new score');

    const getRes1 = await request(app)
      .get('/testscores');
    expect(getRes1.statusCode).toBe(200);
    expect(getRes1.text).toBe(SCORE1);

    const postRes2 = await request(app)
      .post('/testscores')
      .send({
        score: SCORE2
      });
    expect(postRes2.statusCode).toBe(200);
    expect(postRes2.text).toBe('Added new score');

    const getRes2 = await request(app)
      .get('/testscores');
    expect(getRes2.statusCode).toBe(200);
    expect(getRes2.text).toBe(`${SCORE1}, ${SCORE2}`);
    done();
  });

});

