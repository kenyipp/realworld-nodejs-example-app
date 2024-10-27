import { ArticleService } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiFavoriteArticleConstructor {
  articleService: ArticleService;
}

export interface ApiFavoriteArticleInput {
  slug: string;
  userId: string;
}

export type ApiFavoriteArticleOutput = Promise<{ article: DtoArticle }>;
