import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET /api/tags', () => {
  it('should be able to get the tags from article', async () => {
    await setup();
    const response = await request.get('/api/tags');
    expect(response.status).toBe(200);
    expect(response.body.tags).toBeInstanceOf(Array);
    expect(response.body.tags).toHaveLength(4);
  });

  it('should exclude tags from deleted articles', async () => {
    const { articleService, articleA } = await setup();
    await articleService.deleteArticleById({ id: articleA.id });
    const response = await request.get('/api/tags');
    expect(response.status).toBe(200);
    expect(response.body.tags).toBeInstanceOf(Array);
    expect(response.body.tags).toHaveLength(2);
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
  const articleAId = await articleService.createArticle({
    userId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });
  const articleA = await articleService.getArticleById({ id: articleAId });
  assert(articleA);

  const articleBId = await articleService.createArticle({
    userId,
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph()
  });
  const articleB = await articleService.getArticleById({ id: articleBId });
  assert(articleB);

  await articleService.createArticleTags({
    articleId: articleA.id,
    tagList: ['tagA', 'tagB']
  });

  await articleService.createArticleTags({
    articleId: articleB.id,
    tagList: ['tagC', 'tagD']
  });

  return {
    userService,
    articleService,
    user,
    articleA,
    articleB,
    accessToken
  };
};
