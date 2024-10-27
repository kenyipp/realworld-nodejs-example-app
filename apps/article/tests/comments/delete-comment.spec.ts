import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('DELETE /api/articles/:slug/comments', () => {
  it('should be able to delete comments from an article', async () => {
    const { article, commentId, accessToken } = await setup();

    const response = await request
      .delete(`/api/articles/${article.slug}/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.status).toBe(200);
  });

  it('should return a status code of 403 - Forbidden if user tries to delete comments from an article that do not belong to them', async () => {
    const { article, commentId, accessTokenB } = await setup();
    const response = await request
      .delete(`/api/articles/${article.slug}/comments/${commentId}`)
      .set('Authorization', `Bearer ${accessTokenB}`)
      .send();
    expect(response.status).toBe(403);
  });

  it('should return a status code of 401 - Unauthorized if the client does not provide auth headers', async () => {
    const { article, chance, commentId } = await setup();
    const response = await request
      .delete(`/api/articles/${article.slug}/comments/${commentId}`)
      .send({
        comment: {
          body: chance.sentence()
        }
      });
    expect(response.status).toBe(401);
  });

  it("should return a status code of 404 - Not Found if the targeted article's comment does not exist", async () => {
    const { chance, article, accessToken } = await setup();
    const response = await request
      .delete(
        `/api/articles/${article.slug}/comments/00000000-0000-0000-0000-000000`
      )
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        comment: {
          body: chance.sentence()
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

  const userBId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const accessTokenB = authService.generateAccessToken({
    userId: userBId,
    loginId: chance.guid()
  });

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
    accessTokenB,
    commentId
  };
};
