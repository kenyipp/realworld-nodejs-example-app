import { RepoArticle } from '@conduit/core/repository';

export interface CreateArticleHandlerConstructor {
  repoArticle: RepoArticle;
}

export interface CreateArticleInput {
  title: string;
  description: string;
  body: string;
  userId: string;
}

export type CreateArticleOutput = Promise<string>;

/**
 *
 * function: validateIfArticleExist
 *
 */
export interface ValidateIfArticleExistInput {
  title: string;
}

export type ValidateIfArticleExistOutput = Promise<void>;
