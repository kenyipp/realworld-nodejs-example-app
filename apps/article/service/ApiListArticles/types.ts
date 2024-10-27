import { ArticleService } from '@conduit/core/service';

import { DtoArticle } from '../../dto';

export interface ApiListArticlesConstructor {
  articleService: ArticleService;
}

export interface ApiListArticlesInput {
  tag?: string;
  author?: string;
  favorited?: string;
  offset: number;
  limit: number;
  userId?: string;
}

export type ApiListArticlesOutput = Promise<{
  articles: DtoArticle[];
  articlesCount: number;
}>;
