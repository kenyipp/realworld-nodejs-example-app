import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('PUT /api/user', () => {
  it('should be able to update the user account', async () => {
    const { user, accessToken } = await setup();
    const response = await request
      .put('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user: {
          username: 'Ken',
          password: null
        }
      });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.username).toBe('Ken');
    expect(response.body.user.image).toBe(user.image);
    expect(response.body.user.bio).toBe(user.bio);
  });

  it('should be able to update the user password', async () => {
    const { user, accessToken } = await setup();
    let response = await request
      .put('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user: {
          username: 'ken',
          password: 'abc94340634'
        }
      });
    expect(response.status).toBe(200);
    response = await request.post('/api/users/login').send({
      user: {
        email: user.email,
        password: 'abc94340634'
      }
    });
    expect(response.status).toBe(200);
  });

  it('should return a status code of 422 - Unprocessable Entity if the client provides invalid data type', async () => {
    const { accessToken } = await setup();
    const response = await request
      .put('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        user: {
          username: 'ken',
          email: '123'
        }
      });
    expect(response.status).toBe(422);
  });

  it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide the required data fields", async () => {
    const { accessToken } = await setup();
    const response = await request
      .put('/api/user')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ user: {} });
    expect(response.status).toBe(422);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    await setup();
    const response = await request
      .put('/api/user')
      .send({ user: { username: 'ken' } });
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
