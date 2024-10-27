import supertest, { Response } from 'supertest';

import { dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('POST /api/users', () => {
  it('should be able to register an user account', async () => {
    const response = await request.post('/api/users').send({
      user: {
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'jake123'
      }
    });
    expect(response.status).toBe(200);
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBeDefined();
    expect(response.body.user.username).toBeDefined();
    expect(response.body.user.bio).toBeNull();
    expect(response.body.user.image).toBeNull();
    expect(response.body.user.token).toBeDefined();
  });

  it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide the required data fields", async () => {
    const response = await request.post('/api/users').send({
      user: {
        username: 'Jacob'
      }
    });
    expect(response.status).toBe(422);
  });

  it('should return 409 - Conflict if the username or email has been used before', async () => {
    let response: Response | null = null;
    response = await request.post('/api/users').send({
      user: {
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'jake123'
      }
    });
    expect(response.status).toBe(200);
    response = await request.post('/api/users').send({
      user: {
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'jake123'
      }
    });
    expect(response.status).toBe(409);
  });

  it("should return 400 - Bad Request if the password doesn't match the policy", async () => {
    const response = await request.post('/api/users').send({
      user: {
        username: 'Jacob',
        email: 'jake@jake.jake',
        password: 'abcdef'
      }
    });
    expect(response.status).toBe(400);
  });

  beforeEach(() => dangerouslyResetDb());
});
