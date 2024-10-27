import { ArticleService, DbDtoUser } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiCreateArticleConstructor {
  articleService: ArticleService;
}

export interface ApiCreateArticleInput {
  title: string;
  description: string;
  body: string;
  tagList: string[];
  author: DbDtoUser;
}

export type ApiCreateArticleOutput = Promise<{
  article: DtoArticle;
}>;
