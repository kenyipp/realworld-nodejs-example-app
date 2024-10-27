import supertest from 'supertest';

import { app } from '../app';

const request = supertest(app);

describe('GET /', () => {
  it('should be able to retrieve the api documentation', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('text/html; charset=utf-8');
  });
});
