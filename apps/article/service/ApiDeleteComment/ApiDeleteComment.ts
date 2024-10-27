import { ArticleService } from '@conduit/core/service';
import {
  ApiError,
  ApiErrorForbidden,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils/error';

import {
  ApiDeleteCommentConstructor,
  ApiDeleteCommentInput,
  ApiDeleteCommentOutput
} from './types';

export class ApiDeleteComment {
  private articleService: ArticleService;

  constructor({ articleService }: ApiDeleteCommentConstructor) {
    this.articleService = articleService;
  }

  async execute({
    commentId,
    userId
  }: ApiDeleteCommentInput): ApiDeleteCommentOutput {
    try {
      const comment = await this.articleService.getArticleCommentById({
        id: commentId
      });

      if (!comment) {
        throw new ApiErrorNotFound({
          message: "The requested article's comment was not found."
        });
      }

      if (userId !== comment.author.id) {
        throw new ApiErrorForbidden({
          message: 'You are not able to delete comments that do not belong to you.'
        });
      }

      await this.articleService.deleteArticleById({ id: commentId });
    } catch (error) {
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
