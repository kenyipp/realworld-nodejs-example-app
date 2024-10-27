import supertest from 'supertest';

import { app } from '../app';

const request = supertest(app);

describe('GET /api/health-check', () => {
  it('should be able to retrieve the health check', async () => {
    const response = await request.get('/api/health-check');
    expect(response.status).toBe(200);
  });
});
