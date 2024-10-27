import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET /api/articles', () => {
  it('should be able to retrieve a list of all articles', async () => {
    await setup();

    const response = await request.get('/api/articles').send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(4);
    expect(response.body.articlesCount).toBe(4);
  });

  it('should be able to retrieve a list of all articles with access token', async () => {
    const { accessTokenC } = await setup();

    const response = await request
      .get('/api/articles')
      .set('Authorization', `Bearer ${accessTokenC}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(4);
    expect(response.body.articlesCount).toBe(4);
  });

  it('should be able to retrieve a list of articles filtered by tag', async () => {
    await setup();

    let response = await request.get('/api/articles').query({ tag: 'TAG_A' }).send();

    expect(response.status).toBe(200);
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(2);
    expect(response.body.articlesCount).toBe(2);

    response = await request.get('/api/articles').query({ tag: 'TAG_B' }).send();

    expect(response.status).toBe(200);
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(1);
    expect(response.body.articlesCount).toBe(1);
  });

  it('should be able to retrieve a list of articles filtered by author', async () => {
    const { userA } = await setup();

    const response = await request
      .get('/api/articles')
      .query({ author: userA.username })
      .send();

    expect(response.status).toBe(200);
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(2);
    expect(response.body.articlesCount).toBe(2);
  });

  it('should be able to retrieve a list of articles filtered by limit and offset', async () => {
    await setup();
    const response = await request
      .get('/api/articles')
      .query({ limit: 1, offset: 0 })
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(1);
    expect(response.body.articlesCount).toBe(4);
  });

  it('should return a status code of 422 - Unprocessable Entity if the client provides non-number parameters to offset and limit', async () => {
    await setup();
    const response = await request
      .get('/api/articles')
      .query({ limit: 'limit', offset: 'offset' })
      .send();
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

  /**
   *
   * User C
   *
   */
  const userCId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userC = await userService.getUserById({ id: userCId });
  assert(userC);
  const accessTokenC = authService.generateAccessToken({
    userId: userCId,
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

  const articleIdBFromAuthorA = await articleService.createArticle({
    userId: userAId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });

  const articleIdCFromAuthorB = await articleService.createArticle({
    userId: userBId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });

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
    userService,
    articleService,
    userA,
    userB,
    userC,
    accessTokenA,
    accessTokenB,
    accessTokenC,
    articleIdAWithTagFromAuthorA,
    articleIdBFromAuthorA,
    articleIdCFromAuthorB,
    articleIdDWithTagFromAuthorB
  };
};
