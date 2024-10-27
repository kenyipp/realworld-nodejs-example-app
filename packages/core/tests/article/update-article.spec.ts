import assert from 'assert';
import { Chance } from 'chance';

import { ArticleTitleAlreadyTakenError, ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import {
  CreateArticleHandler,
  UpdateArticleHandler
} from '@conduit/core/service/article/implementations';

describe('Article Service - Update Article', () => {
  it('should be able to update the article', async () => {
    const { chance, updateArticleHandler, articleId, repoArticle } = await setup();

    const title = chance.word();
    const description = chance.sentence();
    const body = chance.paragraph();

    await updateArticleHandler.execute({
      id: articleId,
      title,
      description,
      body
    });

    const article = await repoArticle.getArticleById({ id: articleId });
    assert(!!article);

    expect(article.title).toBe(title);
    expect(article.description).toBe(description);
    expect(article.body).toBe(body);
  });

  it('should be able to update specific fields of an article, rather than requiring all fields to be updated', async () => {
    const { chance, updateArticleHandler, repoArticle, articleId } = await setup();

    const title = chance.word();

    await updateArticleHandler.execute({
      id: articleId,
      title
    });

    const article = await repoArticle.getArticleById({ id: articleId });
    assert(!!article);

    expect(article.title).toBe(title);
  });

  it('should throw an error if the title has already been used by another article', async () => {
    const { chance, updateArticleHandler, createArticleHandler, userId } =
      await setup();

    const title = chance.word();

    await createArticleHandler.execute({
      title,
      description: chance.sentence(),
      body: chance.paragraph(),
      userId
    });

    const articleId = await createArticleHandler.execute({
      title: chance.word(),
      description: chance.sentence(),
      body: chance.paragraph(),
      userId
    });

    try {
      await updateArticleHandler.execute({
        id: articleId,
        title
      });
      assert.fail('Should have thrown an error');
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
  const updateArticleHandler = new UpdateArticleHandler({ repoArticle });

  const userService = serviceFactory.newUserService();
  const userId = await userService.createUser({
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  });

  const articleId = await createArticleHandler.execute({
    title: chance.word(),
    description: chance.sentence(),
    body: chance.paragraph(),
    userId
  });

  return {
    chance,
    updateArticleHandler,
    createArticleHandler,
    repoArticle,
    userId,
    articleId
  };
};
