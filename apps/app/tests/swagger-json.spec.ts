import supertest from 'supertest';

import { app } from '../app';

const request = supertest(app);

describe('GET /swagger-json', () => {
  it('should be able to retrieve the swagger.json', async () => {
    const response = await request.get('/swagger.json');
    expect(response.status).toBe(200);
    expect(response.header['content-type']).toBe('application/json; charset=utf-8');
    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
    expect(response.body).toHaveProperty('paths');
  });
});
