import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('POST /api/articles/:slug/comments', () => {
  it('should be able to add a comment to the article', async () => {
    const { chance, userA, articleA, accessTokenA } = await setup();

    const response = await request
      .post(`/api/articles/${articleA.slug}/comments`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send({
        comment: {
          body: chance.sentence()
        }
      });

    expect(response.status).toBe(200);
    expect(response.body.comment).toBeDefined();

    const { comment } = response.body;
    expect(comment.author.following).toBe(false);
    expect(comment.author.username).toBe(userA.username);
  });

  it('should return a status code of 401 - Unauthorized if the client does not provide auth headers', async () => {
    const { chance, articleA } = await setup();
    const response = await request
      .post(`/api/articles/${articleA.slug}/comments`)
      .send({
        comment: {
          body: chance.sentence()
        }
      });
    expect(response.status).toBe(401);
  });

  it('should return a status code of 404 - Not Found if the targeted article does not exist', async () => {
    const { chance, accessTokenB } = await setup();
    const response = await request
      .post('/api/articles/non-existent-article/comments')
      .set('Authorization', `Bearer ${accessTokenB}`)
      .send({
        comment: {
          body: chance.sentence()
        }
      });
    expect(response.status).toBe(404);
  });

  it('should return a status code of 422 - Unprocessable Entity if the client does not provide the required data fields', async () => {
    const { articleA, accessTokenB } = await setup();
    const response = await request
      .post(`/api/articles/${articleA.slug}/comments`)
      .set('Authorization', `Bearer ${accessTokenB}`)
      .send({ comment: {} });

    expect(response.status).toBe(422);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();
  const authService = factory.newAuthService();
  const articleService = factory.newArticleService();

  /**
   *
   * User A
   *
   */
  const userAId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userA = await userService.getUserById({ id: userAId });
  assert(userA);
  const accessTokenA = authService.generateAccessToken({
    userId: userAId,
    loginId: chance.guid()
  });

  /**
   *
   * User B
   *
   */
  const userBId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userB = await userService.getUserById({ id: userBId });
  assert(userB);
  const accessTokenB = authService.generateAccessToken({
    userId: userBId,
    loginId: chance.guid()
  });

  const articleIdAWithTagFromAuthorA = await articleService.createArticle({
    userId: userAId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });

  await articleService.createArticleTags({
    articleId: articleIdAWithTagFromAuthorA,
    tagList: ['TAG_A', 'TAG_B']
  });

  const articleA = await articleService.getArticleById({
    id: articleIdAWithTagFromAuthorA
  });
  assert(articleA);

  const articleIdDWithTagFromAuthorB = await articleService.createArticle({
    userId: userBId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });

  await articleService.createArticleTags({
    articleId: articleIdDWithTagFromAuthorB,
    tagList: ['TAG_A']
  });

  return {
    chance,
    userService,
    articleService,
    userA,
    userB,
    accessTokenA,
    accessTokenB,
    articleA,
    articleIdAWithTagFromAuthorA
  };
};
