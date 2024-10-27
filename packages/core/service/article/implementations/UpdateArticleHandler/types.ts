import { RepoArticle } from '@conduit/core/repository';

export interface UpdateArticleHandlerConstructor {
  repoArticle: RepoArticle;
}

export interface UpdateArticleByIdInput {
  id: string;
  title?: string;
  description?: string;
  body?: string;
}

export type UpdateArticleByIdOutput = Promise<void>;

/**
 *
 * function: validateIfArticleExist
 *
 */
export interface ValidateIfArticleExistInput {
  title: string;
}

export type ValidateIfArticleExistOutput = Promise<void>;
