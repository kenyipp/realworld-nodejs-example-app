import { ArticleService } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiGetArticleConstructor {
  articleService: ArticleService;
}

export interface ApiGetArticleInput {
  slug: string;
  userId?: string;
}

export type ApiGetArticleOutput = Promise<{
  article: DtoArticle;
}>;
