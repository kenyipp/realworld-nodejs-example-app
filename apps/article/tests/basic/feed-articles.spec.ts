import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET /api/articles/feed', () => {
  it("should return an empty array if the user doesn't follow any user", async () => {
    const { accessTokenC } = await setup();

    const response = await request
      .get('/api/articles/feed')
      .set('Authorization', `Bearer ${accessTokenC}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(0);
    expect(response.body.articlesCount).toBe(0);
  });

  it('should be able to return multiple articles created by followed users, ordered by most recent first', async () => {
    const { userService, userA, userC, accessTokenC } = await setup();

    await userService.followUser({
      followerId: userC.id,
      followingUsername: userA.username
    });

    let response = await request
      .get('/api/articles/feed')
      .set('Authorization', `Bearer ${accessTokenC}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(2);
    expect(response.body.articlesCount).toBe(2);

    await userService.unfollowUser({
      followerId: userC.id,
      followingUsername: userA.username
    });

    response = await request
      .get('/api/articles/feed')
      .set('Authorization', `Bearer ${accessTokenC}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.articles).toBeInstanceOf(Array);
    expect(response.body.articles).toHaveLength(0);
    expect(response.body.articlesCount).toBe(0);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    await setup();

    const response = await request.get('/api/articles/feed').send();

    expect(response.status).toBe(401);
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
