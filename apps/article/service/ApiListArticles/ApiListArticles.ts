import { ArticleService } from '@conduit/core/service';
import { logger } from '@conduit/utils';
import { ApiError, ApiErrorInternalServerError } from '@conduit/utils/error';

import { DtoArticle } from '../../dto';
import {
  ApiListArticlesConstructor,
  ApiListArticlesInput,
  ApiListArticlesOutput
} from './types';

export class ApiListArticles {
  private articleService: ArticleService;

  constructor({ articleService }: ApiListArticlesConstructor) {
    this.articleService = articleService;
  }

  async execute({
    tag,
    author,
    favorited,
    limit,
    offset,
    userId
  }: ApiListArticlesInput): ApiListArticlesOutput {
    try {
      const count = await this.articleService.countArticles({
        tags: tag ? [tag] : undefined,
        author,
        favorited
      });

      if (count < 1) {
        return {
          articles: [],
          articlesCount: 0
        };
      }

      const articles = await this.articleService.getArticles({
        tags: tag ? [tag] : undefined,
        author,
        favorited,
        limit,
        offset,
        requestingUserId: userId
      });

      const tagLists = await this.articleService.getTagsByArticleIds({
        articleIds: articles.map((article) => article.id)
      });

      const data = articles.map((article) => {
        const tagList = tagLists[article.id] || [];
        return new DtoArticle({
          ...article,
          tagList: tagList.map((row) => row.tag)
        });
      });

      return {
        articles: data,
        articlesCount: count
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
