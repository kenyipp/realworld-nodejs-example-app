import { Chance } from 'chance';

import { ArticleTitleAlreadyTakenError, ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import { CreateArticleHandler } from '@conduit/core/service/article/implementations';

describe('Article Service - Create Article', () => {
  it('should be able to create an article', async () => {
    const { createArticleHandler, chance, userId } = await setup();

    const articleId = await createArticleHandler.execute({
      title: chance.word(),
      description: chance.sentence(),
      body: chance.paragraph(),
      userId
    });

    expect(articleId).toBeDefined();
  });

  it('should not be able to create article with the same title as an existing article', async () => {
    const { createArticleHandler, chance, userId } = await setup();

    const title = chance.word();
    await createArticleHandler.execute({
      title,
      description: chance.sentence(),
      body: chance.paragraph(),
      userId
    });

    try {
      await createArticleHandler.execute({
        title,
        description: chance.sentence(),
        body: chance.paragraph(),
        userId
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ArticleTitleAlreadyTakenError);
    }
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
