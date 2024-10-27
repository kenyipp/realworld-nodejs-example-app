import { RepoArticle } from '@conduit/core/repository';

import {
  ArticleAlreadyFavoritedError,
  ArticleNotFoundError,
  ArticleNotYetFavoritedError
} from '../../errors';
import {
  FavoriteArticleHandlerConstructor,
  FavoriteArticleInput,
  FavoriteArticleOutput,
  UnfavoriteArticleInput,
  UnfavoriteArticleOutput
} from './types';

export class FavoriteArticleHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: FavoriteArticleHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async favorite({
    userId,
    articleId
  }: FavoriteArticleInput): FavoriteArticleOutput {
    const article = await this.repoArticle.getArticleById({
      id: articleId,
      requestingUserId: userId
    });
    if (!article) {
      throw new ArticleNotFoundError({});
    }
    if (article.favorited) {
      throw new ArticleAlreadyFavoritedError({ userId, articleId });
    }
    await this.repoArticle.favoriteArticle({ userId, articleId });
  }

  async unfavorite({
    userId,
    articleId
  }: UnfavoriteArticleInput): UnfavoriteArticleOutput {
    const article = await this.repoArticle.getArticleById({
      id: articleId,
      requestingUserId: userId
    });
    if (!article) {
      throw new ArticleNotFoundError({});
    }
    if (!article.favorited) {
      throw new ArticleNotYetFavoritedError({ userId, articleId });
    }
    await this.repoArticle.unfavoriteArticle({ articleId, userId });
  }
}
