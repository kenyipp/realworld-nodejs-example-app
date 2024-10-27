import { RepoArticle } from '@conduit/core/repository';

export interface CreateArticleCommentHandlerConstructor {
  repoArticle: RepoArticle;
}

export interface CreateArticleCommentInput {
  articleId: string;
  body: string;
  userId: string;
}

export type CreateArticleCommentOutput = Promise<string>;

/**
 *
 * function: validateArticle
 *
 */
export interface ValidateArticleInput {
  articleId: string;
}

export type ValidateArticleOutput = Promise<void>;
