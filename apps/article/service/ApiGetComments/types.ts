import { ArticleService } from '@conduit/core';

import { DtoComment } from '../../dto';

export interface ApiGetCommentsConstructor {
  articleService: ArticleService;
}

export interface ApiGetCommentsInput {
  slug: string;
  limit: number;
  offset: number;
  userId?: string;
}

export type ApiGetCommentsOutput = Promise<{
  comments: DtoComment[];
  count: number;
}>;
