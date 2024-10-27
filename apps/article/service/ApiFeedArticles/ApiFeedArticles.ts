import { ArticleService } from '@conduit/core/service';
import { ApiError, ApiErrorInternalServerError } from '@conduit/utils/error';

import { DtoArticle } from '../../dto';
import {
  ApiFeedArticlesConstructor,
  ApiFeedArticlesInput,
  ApiFeedArticlesOutput
} from './types';

export class ApiFeedArticles {
  private articleService: ArticleService;

  constructor({ articleService }: ApiFeedArticlesConstructor) {
    this.articleService = articleService;
  }

  async execute({
    limit,
    offset,
    userId
  }: ApiFeedArticlesInput): ApiFeedArticlesOutput {
    try {
      const count = await this.articleService.countArticles({
        followedBy: userId
      });

      if (count < 1) {
        return {
          articles: [],
          articlesCount: 0
        };
      }

      const articles = await this.articleService.getArticles({
        followedBy: userId,
        requestingUserId: userId,
        limit,
        offset
      });

      const tagLists = await this.articleService.getTagsByArticleIds({
        articleIds: articles.map((article) => article.id)
      });

      const data = articles.map((article) => {
        const tagList = tagLists[article.id] || [];
        return new DtoArticle({
          ...article,
          tagList: tagList.map((tag) => tag.tag)
        });
      });

      return {
        articles: data,
        articlesCount: count
      };
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
