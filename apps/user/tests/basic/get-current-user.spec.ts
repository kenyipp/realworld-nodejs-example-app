import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET /api/user', () => {
  it('should be able to get the current user', async () => {
    const { user, accessToken } = await setup();
    const response = await request
      .get('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.username).toBe(user.username);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    const response = await request.get('/api/user').send();
    expect(response.status).toBe(401);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();
  const authService = factory.newAuthService();
  const userId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const accessToken = authService.generateAccessToken({
    userId,
    loginId: chance.guid()
  });
  const user = await userService.getUserById({ id: userId });
  assert(user);
  return {
    user,
    userService,
    accessToken
  };
};
