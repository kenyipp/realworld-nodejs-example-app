import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';
import { DtoArticle } from '../../dto';

const request = supertest(app);

describe('GET /api/articles/:slug', () => {
  it('should be able to get an article', async () => {
    const { article } = await setup();
    const response = await request.get(`/api/articles/${article.slug}`).send();
    expect(response.status).toBe(200);
    expect(response.body.article).toBeDefined();
    const dtoArticle: DtoArticle = response.body.article;
    expect(dtoArticle.slug).toBe(article.slug);
  });

  it('should return a status code of 404 - Not Found if the author of the targeted article had been deleted', async () => {
    const { articleService, article } = await setup();
    await articleService.deleteArticleById({ id: article.id });
    const response = await request.get(`/api/articles/${article.slug}`).send();
    expect(response.status).toBe(404);
  });

  it('should return a status code of 404 - Not Found if the targeted article does not exist', async () => {
    await setup();
    const response = await request.get('/api/articles/non-existent-article').send();
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
    userService,
    articleService,
    user,
    article,
    accessToken
  };
};
