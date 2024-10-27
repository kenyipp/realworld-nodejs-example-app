import { ArticleService } from '@conduit/core';

export interface ApiDeleteArticleConstructor {
  articleService: ArticleService;
}

export interface ApiDeleteArticleInput {
  slug: string;
  userId: string;
}

export type ApiDeleteArticleOutput = Promise<void>;
