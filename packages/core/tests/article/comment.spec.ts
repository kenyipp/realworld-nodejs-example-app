import assert from 'assert';
import { Chance } from 'chance';

import { ArticleNotFoundError, ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';

describe('Article Service - Article Comment', () => {
  describe('Create Article Comment', () => {
    it('should be able to add comment to an article', async () => {
      const { articleService, userId, articleId } = await setup();

      const commentId = await articleService.createArticleComment({
        articleId,
        userId,
        body: 'This is a comment'
      });

      const comment = await articleService.getArticleCommentById({ id: commentId });
      assert(comment);
      expect(comment.body).toBe('This is a comment');
    });

    it('should throw an error if the article does not exist', async () => {
      const { articleService, userId } = await setup();

      await expect(
        articleService.createArticleComment({
          articleId: 'non-existing-article-id',
          userId,
          body: 'This is a comment'
        })
      ).rejects.toThrow(ArticleNotFoundError);
    });

    it('should throw an error when trying to add a comment to a deleted article', async () => {
      const { articleService, userId, articleId } = await setup();

      await articleService.deleteArticleById({ id: articleId });

      await expect(
        articleService.createArticleComment({
          articleId,
          userId,
          body: 'This is a comment'
        })
      ).rejects.toThrow(ArticleNotFoundError);
    });
  });

  describe('Delete comment', () => {
    it('should be able to delete the comment', async () => {
      const { articleService, userId, articleId } = await setup();

      const commentId = await articleService.createArticleComment({
        articleId,
        userId,
        body: 'This is a comment'
      });

      let response = await articleService.getArticleCommentsByArticleId({
        articleId,
        limit: 10,
        offset: 0
      });
      expect(response.count).toBe(1);

      await articleService.deleteArticleCommentById({ id: commentId });

      response = await articleService.getArticleCommentsByArticleId({
        articleId,
        limit: 10,
        offset: 0
      });
      expect(response.count).toBe(0);
    });
  });

  describe('Retrieve comments', () => {
    it('should be able to get comments from an article', async () => {
      const { articleService, userId, articleId } = await setup();

      await articleService.createArticleComment({
        articleId,
        userId,
        body: 'This is a comment'
      });

      await articleService.createArticleComment({
        articleId,
        userId,
        body: 'This is a comment'
      });

      const response = await articleService.getArticleCommentsByArticleId({
        articleId,
        limit: 10,
        offset: 0
      });
      expect(response.count).toBe(2);
      expect(response.comments.length).toBe(2);
    });

    it('should not be possible to retrieve the deleted comments from an article', async () => {
      const { articleService, userId, articleId } = await setup();

      const commentId = await articleService.createArticleComment({
        articleId,
        userId,
        body: 'This is a comment'
      });

      let response = await articleService.getArticleCommentsByArticleId({
        articleId,
        limit: 10,
        offset: 0
      });
      expect(response.count).toBe(1);

      await articleService.deleteArticleCommentById({ id: commentId });

      response = await articleService.getArticleCommentsByArticleId({
        articleId,
        limit: 10,
        offset: 0
      });
      expect(response.count).toBe(0);
    });
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const serviceFactory = new ServiceFactory();
  const userService = serviceFactory.newUserService();
  const articleService = serviceFactory.newArticleService();

  const userId = await userService.createUser({
    email: chance.email(),
    username: chance.word(),
    password: 'Abcd1234'
  });

  const articleId = await articleService.createArticle({
    title: chance.sentence(),
    description: chance.paragraph(),
    body: chance.paragraph(),
    userId
  });

  return {
    chance,
    userService,
    articleService,
    articleId,
    userId
  };
};
