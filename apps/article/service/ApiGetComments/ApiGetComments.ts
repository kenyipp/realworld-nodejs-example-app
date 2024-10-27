import { ArticleService } from '@conduit/core/service';
import { logger } from '@conduit/utils';
import {
  ApiError,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils/error';

import { DtoComment } from '../../dto';
import {
  ApiGetCommentsConstructor,
  ApiGetCommentsInput,
  ApiGetCommentsOutput
} from './types';

export class ApiGetComments {
  private articleService: ArticleService;

  constructor({ articleService }: ApiGetCommentsConstructor) {
    this.articleService = articleService;
  }

  async execute({
    slug,
    userId,
    limit,
    offset
  }: ApiGetCommentsInput): ApiGetCommentsOutput {
    try {
      const article = await this.articleService.getArticleBySlug({
        slug
      });
      if (!article) {
        throw new ApiErrorNotFound({});
      }
      const { comments, count } =
        await this.articleService.getArticleCommentsByArticleId({
          articleId: article.id,
          requestingUserId: userId,
          limit,
          offset
        });
      return {
        comments: comments.map((comment) => new DtoComment(comment)),
        count
      };
    } catch (error) {
      logger.error(error);
      throw this.convertErrorToApiError(error);
    }
  }

  private convertErrorToApiError(error: any) {
    if (error instanceof ApiError) {
      return error;
    }
    return new ApiErrorInternalServerError({});
  }
}
