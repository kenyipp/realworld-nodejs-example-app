import { ArticleService } from '@conduit/core';

export interface ApiGetTagsConstructor {
  articleService: ArticleService;
}

export type ApiGetTagsOutput = Promise<{
  tags: string[];
}>;
