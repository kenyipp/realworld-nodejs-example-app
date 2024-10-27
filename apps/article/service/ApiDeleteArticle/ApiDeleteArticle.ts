import { ArticleNotFoundError, ArticleService } from '@conduit/core/service';
import { logger } from '@conduit/utils';
import {
  ApiError,
  ApiErrorForbidden,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils/error';

import {
  ApiDeleteArticleConstructor,
  ApiDeleteArticleInput,
  ApiDeleteArticleOutput
} from './types';

export class ApiDeleteArticle {
  private articleService: ArticleService;

  constructor({ articleService }: ApiDeleteArticleConstructor) {
    this.articleService = articleService;
  }

  async execute({ slug, userId }: ApiDeleteArticleInput): ApiDeleteArticleOutput {
    try {
      const article = await this.articleService.getArticleBySlug({
        slug
      });
      if (!article) {
        throw new ArticleNotFoundError({ slug });
      }
      if (article.userId !== userId) {
        throw new ApiErrorForbidden({
          message: 'You are not able to delete article that do not belong to you.'
        });
      }
      await this.articleService.deleteArticleById({ id: article.id });
    } catch (error) {
      throw this.convertErrorToApiError(error);
    }
  }

  private convertErrorToApiError(error: any) {
    if (error instanceof ApiError) {
      return error;
    }
    if (error instanceof ArticleNotFoundError) {
      throw new ApiErrorNotFound({
        message: error.message,
        cause: error
      });
    }
    logger.error(error);
    return new ApiErrorInternalServerError({});
  }
}
