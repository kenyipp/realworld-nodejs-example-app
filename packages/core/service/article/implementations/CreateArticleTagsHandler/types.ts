import { RepoArticle } from '@conduit/core/repository';

export interface CreateArticleTagsHandlerConstructor {
  repoArticle: RepoArticle;
}

/**
 *
 * function: createTagsForArticle
 *
 */
export interface CreateTagsForArticleInput {
  articleId: string;
  tagList: string[];
}

export type CreateTagsForArticleOutput = Promise<void>;

/**
 *
 * function: validateArticleId
 *
 */
export interface ValidateArticleIdInput {
  articleId: string;
}

export type ValidateArticleIdOutput = Promise<void>;
