import { ArticleService } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiUnfavoriteArticleConstructor {
  articleService: ArticleService;
}

export interface ApiUnfavoriteArticleInput {
  slug: string;
  userId: string;
}

export type ApiUnfavoriteArticleOutput = Promise<{ article: DtoArticle }>;
