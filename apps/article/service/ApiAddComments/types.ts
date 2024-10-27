import { ArticleService } from '@conduit/core';

import { DtoComment } from '../../dto';

export interface ApiAddCommentsConstructor {
  articleService: ArticleService;
}

export interface ApiAddCommentsInput {
  slug: string;
  body: string;
  userId: string;
}

export type ApiAddCommentsOutput = Promise<{
  comment: DtoComment;
}>;
