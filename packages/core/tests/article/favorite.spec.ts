import assert from 'assert';
import { Chance } from 'chance';

import {
  ArticleAlreadyFavoritedError,
  ArticleNotYetFavoritedError,
  ServiceFactory
} from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';

describe('Article Service - Favorite Article', () => {
  describe('Favorite an Article', () => {
    it('should be able to favorite an article', async () => {
      const { articleService, articleAId, userBId } = await setup();
      await articleService.favoriteArticle({
        articleId: articleAId,
        userId: userBId
      });

      const article = await articleService.getArticleById({
        id: articleAId,
        requestingUserId: userBId
      });
      assert(article);
      expect(article.favorited).toBe(true);
      expect(article.favoritesCount).toBe(1);
    });

    it('should throw an error if the user tries to favorite an article that has already been favorited', async () => {
      const { articleService, articleAId, userBId } = await setup();
      await articleService.favoriteArticle({
        articleId: articleAId,
        userId: userBId
      });

      try {
        await articleService.favoriteArticle({
          articleId: articleAId,
          userId: userBId
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ArticleAlreadyFavoritedError);
      }
    });
  });

  describe('Unfavorite an Article', () => {
    it('should be able to unfavorite an article', async () => {
      const { articleService, articleAId, userBId } = await setup();

      await articleService.favoriteArticle({
        articleId: articleAId,
        userId: userBId
      });

      await articleService.unfavoriteArticle({
        articleId: articleAId,
        userId: userBId
      });

      const article = await articleService.getArticleById({
        id: articleAId,
        requestingUserId: userBId
      });
      assert(article);
      expect(article.favorited).toBe(false);
      expect(article.favoritesCount).toBe(0);
    });

    it('should throw an error if the user tries to unfavorite an article that has already been unfavorited', async () => {
      const { articleService, articleAId, userBId } = await setup();

      try {
        await articleService.unfavoriteArticle({
          articleId: articleAId,
          userId: userBId
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ArticleNotYetFavoritedError);
      }

      const article = await articleService.getArticleById({
        id: articleAId,
        requestingUserId: userBId
      });

      assert(article);
      expect(article.favorited).toBe(false);
      expect(article.favoritesCount).toBe(0);
    });
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const repoFactory = new RepoFactory();
  const serviceFactory = new ServiceFactory();
  const repoArticle = repoFactory.newRepoArticle();

  const articleService = serviceFactory.newArticleService();
  const userService = serviceFactory.newUserService();

  const userAId = await userService.createUser({
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  });

  const userBId = await userService.createUser({
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  });

  const articleAId = await articleService.createArticle({
    title: chance.word(),
    body: chance.paragraph(),
    description: chance.sentence(),
    userId: userAId
  });

  return { chance, articleService, repoArticle, userAId, userBId, articleAId };
};
