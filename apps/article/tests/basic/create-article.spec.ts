import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('POST /api/articles', () => {
  it('should be able to create an article', async () => {
    const { accessToken } = await setup();
    const response = await request
      .post('/api/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        article: {
          title: 'How to train your dragon',
          description: 'Ever wonder how?',
          body: 'You have to believe',
          tagList: ['react.js', 'angular.js', 'dragons']
        }
      });
    expect(response.status).toBe(200);
    expect(response.body.article).toBeDefined();
    const { article } = response.body;
    expect(article.tagList).toHaveLength(3);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    const response = await request.post('/api/articles').send({
      article: {
        title: 'How to train your dragon',
        description: 'Ever wonder how?',
        body: 'You have to believe',
        tagList: ['react.js', 'angular.js', 'dragons']
      }
    });
    expect(response.status).toBe(401);
  });

  it('should return a status code of 422 - Unprocessable Entity if the client provides invalid data', async () => {
    const { accessToken } = await setup();
    const response = await request
      .post('/api/articles')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ article: { title: 'How to train your dragon' } });
    expect(response.status).toBe(422);
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
    userService,
    user,
    accessToken
  };
};
