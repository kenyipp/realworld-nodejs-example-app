import { DbDtoArticleCommentWithProfile } from '@conduit/core/database';
import { RepoArticle } from '@conduit/core/repository';

export interface GetArticleCommentsHandlerConstructor {
  repoArticle: RepoArticle;
}

export interface GetArticleCommentsByArticleIdInput {
  articleId: string;
  limit: number;
  offset: number;
  requestingUserId?: string;
}

export type GetArticleCommentsByArticleIdOutput = Promise<{
  comments: DbDtoArticleCommentWithProfile[];
  count: number;
}>;
