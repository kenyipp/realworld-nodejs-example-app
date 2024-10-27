import { RepoArticle } from '@conduit/core/repository';

export interface FavoriteArticleHandlerConstructor {
  repoArticle: RepoArticle;
}

/**
 *
 * function: favoriteArticle
 *
 */
export interface FavoriteArticleInput {
  userId: string;
  articleId: string;
}

export type FavoriteArticleOutput = Promise<void>;

/**
 *
 * function: unfavoriteArticle
 *
 */
export interface UnfavoriteArticleInput {
  userId: string;
  articleId: string;
}

export type UnfavoriteArticleOutput = Promise<void>;
