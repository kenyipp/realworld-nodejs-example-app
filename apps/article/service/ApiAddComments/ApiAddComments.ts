import { ArticleNotFoundError, ArticleService } from '@conduit/core/service';
import {
  ApiErrorInternalServerError,
  ApiErrorNotFound,
  logger
} from '@conduit/utils';

import { DtoComment } from '../../dto';
import {
  ApiAddCommentsConstructor,
  ApiAddCommentsInput,
  ApiAddCommentsOutput
} from './types';

export class ApiAddComments {
  private articleService: ArticleService;

  constructor({ articleService }: ApiAddCommentsConstructor) {
    this.articleService = articleService;
  }

  async execute({ slug, body, userId }: ApiAddCommentsInput): ApiAddCommentsOutput {
    try {
      const article = await this.articleService.getArticleBySlug({
        slug
      });
      if (!article) {
        throw new ArticleNotFoundError({});
      }
      const commentId = await this.articleService.createArticleComment({
        articleId: article.id,
        body,
        userId
      });
      const comment = await this.articleService
        .getArticleCommentById({
          id: commentId
        })
        .then((row) => {
          if (!row) {
            return undefined;
          }
          return new DtoComment({
            id: row.id,
            body: row.body,
            createdAt: row.createdAt,
            updatedAt: row.updatedAt,
            author: {
              username: row.author.username,
              bio: row.author.bio,
              image: row.author.image,
              following: Boolean(row.author.following)
            }
          });
        });

      if (!comment) {
        throw new ApiErrorInternalServerError({});
      }
      return {
        comment
      };
    } catch (error) {
      throw this.convertErrorToApiError(error);
    }
  }

  private convertErrorToApiError(error: any) {
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
