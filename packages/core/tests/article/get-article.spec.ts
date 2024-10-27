import assert from 'assert';
import { Chance } from 'chance';

import { ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import { CreateArticleHandler } from '@conduit/core/service/article/implementations';

describe('Article Repository - Get Article', () => {
  it('should be able to get the details of an article by slug', async () => {
    const { createArticleHandler, userId, repoArticle } = await setup();
    const title = 'hello-world';
    const description = 'This is a description';
    const body = 'This is the body';

    const articleId = await createArticleHandler.execute({
      title,
      description,
      body,
      userId
    });

    const article = await repoArticle.getArticleBySlug({ slug: title });

    assert(article);
    expect(article.id).toBe(articleId);
    expect(article.title).toBe(title);
    expect(article.description).toBe(description);
    expect(article.body).toBe(body);
    expect(article.author.id).toBe(userId);
    expect(article.author.following).toBeFalsy();
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const repoFactory = new RepoFactory();
  const serviceFactory = new ServiceFactory();
  const repoArticle = repoFactory.newRepoArticle();
  const createArticleHandler = new CreateArticleHandler({ repoArticle });

  const userService = serviceFactory.newUserService();
  const userId = await userService.createUser({
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  });

  return { chance, createArticleHandler, repoArticle, userId };
};
