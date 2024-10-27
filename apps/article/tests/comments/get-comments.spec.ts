import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET `/api/articles/:slug/comments', () => {
  it('should be able to get comments from an article', async () => {
    const { article } = await setup();
    const response = await request
      .get(`/api/articles/${article.slug}/comments`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body.comments).toBeDefined();
    expect(response.body.comments).toBeInstanceOf(Array);
    expect(response.body.comments).toHaveLength(1);
  });

  it('should return a status code of 404 - Not Found if the article does not exist', async () => {
    const response = await request
      .get('/api/articles/00000000-0000-0000-0000-00000000/comments')
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

  const commentId = await articleService.createArticleComment({
    articleId: article.id,
    userId,
    body: chance.sentence()
  });

  return {
    chance,
    userService,
    articleService,
    authService,
    user,
    article,
    accessToken,
    commentId
  };
};
