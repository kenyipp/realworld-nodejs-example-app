import { ArticleService } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiFeedArticlesConstructor {
  articleService: ArticleService;
}

export interface ApiFeedArticlesInput {
  limit: number;
  offset: number;
  userId: string;
}

export type ApiFeedArticlesOutput = Promise<{
  articles: DtoArticle[];
  articlesCount: number;
}>;
