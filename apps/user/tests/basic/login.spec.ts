import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('POST /api/users/login', () => {
  it('should be able to login with a correct username and password', async () => {
    const { user } = await setup();
    const response = await request.post('/api/users/login').send({
      user: {
        email: user.email,
        password: 'Abcd1234'
      }
    });
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.user).toBeDefined();
    expect(response.body.user.email).toBe(user.email);
    expect(response.body.user.token).toBeDefined();
    expect(response.body.user.username).toBe(user.username);
  });

  it('should throw an error if the password entered is incorrect', async () => {
    const { user } = await setup();
    const response = await request.post('/api/users/login').send({
      user: {
        email: user.email,
        password: 'jake1234'
      }
    });
    expect(response.status).toBe(401);
  });

  it('should throw an error if the user does not exist', async () => {
    const { user } = await setup();
    const response = await request.post('/api/users/login').send({
      user: {
        email: `${user.email}.jake`,
        password: 'Abcd1234'
      }
    });
    expect(response.status).toBe(404);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();

  const userId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const user = await userService.getUserById({ id: userId });
  assert(user);
  return { user };
};
