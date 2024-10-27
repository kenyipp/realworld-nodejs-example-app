import { isNil } from 'lodash';

import {
  ArticleService,
  ArticleTitleAlreadyTakenError
} from '@conduit/core/service';
import { logger } from '@conduit/utils';
import {
  ApiError,
  ApiErrorConflict,
  ApiErrorForbidden,
  ApiErrorInternalServerError,
  ApiErrorNotFound,
  ApiErrorUnprocessableEntity
} from '@conduit/utils/error';

import { DtoArticle } from '../../dto';
import { ApiGetArticle } from '../ApiGetArticle';
import {
  ApiUpdateArticleConstructor,
  ApiUpdateArticleInput,
  ApiUpdateArticleOutput,
  GetArticleBySlugInput,
  GetArticleBySlugOutput,
  GetUpdatedArticleInput,
  GetUpdatedArticleOutput,
  ValidateInputInput,
  ValidateInputOutput
} from './types';

export class ApiUpdateArticle {
  private articleService: ArticleService;
  private apiGetArticle: ApiGetArticle;

  constructor({ articleService }: ApiUpdateArticleConstructor) {
    this.articleService = articleService;
    this.apiGetArticle = new ApiGetArticle({ articleService });
  }

  async execute({
    slug,
    userId,
    title,
    description,
    body
  }: ApiUpdateArticleInput): ApiUpdateArticleOutput {
    try {
      const article = await this.getArticleBySlug({ slug });

      this.validateInput({
        userId,
        authorId: article.userId,
        title,
        description,
        body
      });

      await this.articleService.updateArticleById({
        id: article.id,
        title,
        description,
        body
      });

      const updated = await this.getUpdatedArticle({
        articleId: article.id
      });

      return {
        article: updated
      };
    } catch (error) {
      throw this.convertErrorToApiError(error);
    }
  }

  private async getUpdatedArticle({
    articleId
  }: GetUpdatedArticleInput): GetUpdatedArticleOutput {
    const article = await this.articleService.getArticleById({
      id: articleId
    });
    if (article === undefined) {
      throw new ApiErrorInternalServerError({});
    }
    const tags = await this.articleService.getTagsByArticleId({
      articleId: article.id
    });
    const data = new DtoArticle({
      ...article,
      tagList: tags.map((tag) => tag.tag)
    });
    return data;
  }

  private async getArticleBySlug({
    slug
  }: GetArticleBySlugInput): GetArticleBySlugOutput {
    const article = await this.articleService.getArticleBySlug({
      slug
    });
    if (article === undefined) {
      throw new ApiErrorNotFound({});
    }
    return article;
  }

  private validateInput({
    userId,
    authorId,
    title,
    description,
    body
  }: ValidateInputInput): ValidateInputOutput {
    if (userId !== authorId) {
      throw new ApiErrorForbidden({
        message: 'You are not able to update article that do not belong to you.'
      });
    }
    if (isNil(title) && isNil(description) && isNil(body)) {
      throw new ApiErrorUnprocessableEntity({
        message: 'At least one data field must be provided to update the article.'
      });
    }
  }

  private convertErrorToApiError(error: any) {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof ArticleTitleAlreadyTakenError) {
      throw new ApiErrorConflict({
        message: error.message,
        cause: error
      });
    }
    logger.error(error);
    return new ApiErrorInternalServerError({});
  }
}
