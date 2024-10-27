import { ArticleNotFoundError, ArticleService } from '@conduit/core/service';
import {
  ApiError,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils/error';

import { DtoArticle } from '../../dto';
import {
  ApiGetArticleConstructor,
  ApiGetArticleInput,
  ApiGetArticleOutput
} from './types';

export class ApiGetArticle {
  private articleService: ArticleService;

  constructor({ articleService }: ApiGetArticleConstructor) {
    this.articleService = articleService;
  }

  async execute({ slug, userId }: ApiGetArticleInput): ApiGetArticleOutput {
    try {
      const article = await this.articleService.getArticleBySlug({
        slug,
        requestingUserId: userId
      });

      if (!article) {
        throw new ApiErrorNotFound({
          message: 'Invalid article'
        });
      }

      const tags = await this.articleService.getTagsByArticleId({
        articleId: article.id
      });

      const data = new DtoArticle({
        ...article,
        tagList: tags.map((tag) => tag.tag)
      });
      return { article: data };
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
    return new ApiErrorInternalServerError({});
  }
}
