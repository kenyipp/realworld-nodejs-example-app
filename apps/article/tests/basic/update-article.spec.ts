import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';
import { DtoArticle } from '../../dto';

const request = supertest(app);

describe('PUT /api/articles/:slug', () => {
  it('should be able to update the article', async () => {
    const { article, accessToken } = await setup();
    const response = await request
      .put(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ article: { body: 'HELLO_WORLD' } });
    expect(response.status).toBe(200);
    expect(response.body.article).toBeDefined();
    const dtoArticle: DtoArticle = response.body.article;
    expect(dtoArticle.body).toBe('HELLO_WORLD');
  });

  it('should update the slug to reflect the new title when the title of an article is updated using the API. ', async () => {
    const { article, accessToken } = await setup();
    const response = await request
      .put(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ article: { title: 'UPDATED_TITLE' } });
    expect(response.status).toBe(200);
    expect(response.body.article).toBeDefined();
    const dtoArticle: DtoArticle = response.body.article;
    // The slug of the article should be updated
    expect(dtoArticle.slug).not.toBe(article.slug);
    expect(dtoArticle.title).toBe('UPDATED_TITLE');
  });

  it('should return a status code of 403 - Forbidden if the user tries to update an article that does not belong to them', async () => {
    const { article, guestAccessToken } = await setup();
    const response = await request
      .put(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${guestAccessToken}`)
      .send({ article: { title: 'UPDATED_TITLE' } });
    expect(response.status).toBe(403);
  });

  it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
    const { article } = await setup();
    const response = await request
      .put(`/api/articles/${article.slug}`)
      .send({ article: { title: 'UPDATED_TITLE' } });
    expect(response.status).toBe(401);
  });

  it('should return a status code of 404 - Not Found if the targeted article does not exist', async () => {
    const { accessToken } = await setup();
    const response = await request
      .put('/api/articles/non-existent-article')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ article: { body: 'HELLO_WORLD' } });
    expect(response.status).toBe(404);
  });

  it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide any data fields", async () => {
    const { article, accessToken } = await setup();
    const response = await request
      .put(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ article: {} });
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
  const articleId = await articleService.createArticle({
    userId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });
  const article = await articleService.getArticleById({ id: articleId });
  assert(article);

  const guest = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const guestAccessToken = authService.generateAccessToken({
    userId: guest,
    loginId: chance.guid()
  });

  return {
    chance,
    userService,
    articleService,
    authService,
    user,
    article,
    accessToken,
    guest,
    guestAccessToken
  };
};
