import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('DELETE /api/articles/:slug', () => {
  it('should be able to delete an article', async () => {
    const { article, accessToken } = await setup();

    let response = await request
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);

    response = await request.get(`/api/articles/${article.slug}`).send();

    expect(response.status).toBe(404);
  });

  it('should return a status code of 403 - Forbidden if the user tries to delete an article that does not belong to them', async () => {
    const { article, userService, authService, chance } = await setup();

    const user = await userService.createUser({
      email: chance.email(),
      password: 'Abcd1234',
      username: chance.word()
    });

    const accessToken = authService.generateAccessToken({
      userId: user,
      loginId: chance.guid()
    });

    const response = await request
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(403);
  });

  it('should return a status code of 401 - Unauthorized if the client does not provide auth headers', async () => {
    const { article } = await setup();

    const response = await request.delete(`/api/articles/${article.slug}`).send();

    expect(response.status).toBe(401);
  });

  it('should return a status code of 404 - Not Found if the user tries to delete a deleted article', async () => {
    const { article, articleService, accessToken } = await setup();

    await articleService.deleteArticleById({ id: article.id });

    const response = await request
      .delete(`/api/articles/${article.slug}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(404);
  });

  it('should return a status code of 404 - Not Found if the targeted article does not exist', async () => {
    const { accessToken } = await setup();

    const response = await request
      .delete('/api/articles/NOT_EXIST_ARTICLE')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(404);
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
  return {
    chance,
    userService,
    articleService,
    authService,
    user,
    article,
    accessToken
  };
};
