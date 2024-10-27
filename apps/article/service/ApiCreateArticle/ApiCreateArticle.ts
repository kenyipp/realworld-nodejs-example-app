import { ArticleService, ArticleTitleAlreadyTakenError } from '@conduit/core';
import {
  ApiErrorConflict,
  ApiErrorInternalServerError,
  logger
} from '@conduit/utils';

import { DtoArticle } from '../../dto';
import {
  ApiCreateArticleConstructor,
  ApiCreateArticleInput,
  ApiCreateArticleOutput
} from './types';

export class ApiCreateArticle {
  private articleService: ArticleService;

  constructor({ articleService }: ApiCreateArticleConstructor) {
    this.articleService = articleService;
  }

  async execute({
    title,
    description,
    body,
    tagList,
    author
  }: ApiCreateArticleInput): ApiCreateArticleOutput {
    try {
      const articleId = await this.articleService.createArticle({
        title,
        description,
        body,
        userId: author.id
      });

      await this.articleService.createArticleTags({
        articleId,
        tagList
      });

      const article = await this.articleService.getArticleById({ id: articleId });

      if (!article) {
        throw new ApiErrorInternalServerError({});
      }

      const dtoArticle = new DtoArticle({
        slug: article.slug,
        title: article.title,
        description: article.description,
        body: article.body,
        tagList,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        favorited: false,
        favoritesCount: 0,
        author: {
          username: author.username,
          bio: author.bio,
          image: author.image,
          following: false
        }
      });
      return { article: dtoArticle };
    } catch (error) {
      throw this.convertErrorToApiError(error);
    }
  }

  private convertErrorToApiError(error: unknown) {
    if (error instanceof ArticleTitleAlreadyTakenError) {
      return new ApiErrorConflict({
        message: error.message,
        cause: error
      });
    }
    logger.error(error);
    return new ApiErrorInternalServerError({});
  }
}
