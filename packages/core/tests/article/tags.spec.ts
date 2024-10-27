import assert from 'assert';
import { Chance } from 'chance';

import { ArticleNotFoundError, RecordStatus, ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import {
  CreateArticleHandler,
  CreateArticleTagsHandler
} from '@conduit/core/service/article/implementations';

import { knex } from '../../database/knex';

describe('Article Service - Article Tags', () => {
  it('should be able to create tags for an article', async () => {
    const { articleId, createArticleTagsHandler } = await setup();

    await createArticleTagsHandler.execute({
      articleId,
      tagList: ['tag1', 'tag2']
    });
  });

  it('should be able to return a list of tags for an article', async () => {
    const { repoArticle, articleId, createArticleTagsHandler } = await setup();

    await createArticleTagsHandler.execute({
      articleId,
      tagList: ['tag1', 'tag2']
    });

    const tags = await repoArticle.getTagsByArticleId({ articleId });
    expect(tags).toHaveLength(2);
    expect(tags.map((item) => item.tag)).toContain('tag1');
    expect(tags.map((item) => item.tag)).toContain('tag2');
  });

  it('should throw an error when attempting to retrieve tags from an article that has been deleted', async () => {
    const { articleId, createArticleTagsHandler } = await setup();

    await knex
      .table('article')
      .update({ record_status: RecordStatus.Deleted })
      .where({ article_id: articleId });

    try {
      await createArticleTagsHandler.execute({
        articleId,
        tagList: ['tag1', 'tag2']
      });
      assert.fail('Expected an error to be thrown');
    } catch (error) {
      expect(error).toBeInstanceOf(ArticleNotFoundError);
    }
  });

  it('should return all article tags for all articles that have not been deleted', async () => {
    const { createArticleTagsHandler, articleService, articleId } = await setup();

    await createArticleTagsHandler.execute({
      articleId,
      tagList: ['tag1', 'tag2']
    });

    let tags = await articleService.getAvailableTags();
    expect(tags).toHaveLength(2);

    await knex
      .table('article')
      .update({ record_status: RecordStatus.Deleted })
      .where({ article_id: articleId });

    tags = await articleService.getAvailableTags();
    expect(tags).toHaveLength(0);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const repoFactory = new RepoFactory();
  const serviceFactory = new ServiceFactory();
  const repoArticle = repoFactory.newRepoArticle();
  const articleService = serviceFactory.newArticleService();
  const createArticleHandler = new CreateArticleHandler({ repoArticle });
  const createArticleTagsHandler = new CreateArticleTagsHandler({ repoArticle });

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
    repoArticle,
    articleId,
    createArticleTagsHandler,
    articleService
  };
};
