import { Knex } from 'knex';
import { Dictionary } from 'lodash';

import {
  DbDtoArticle,
  DbDtoArticleComment,
  DbDtoArticleCommentWithProfile,
  DbDtoArticleTag
} from './dto';

/**
 *
 * function: createArticle
 *
 */
export interface CreateArticleInput {
  title: string;
  slug: string;
  description: string;
  body: string;
  userId: string;
}

export type CreateArticleOutput = Promise<string>;

/**
 *
 * function: createTagsForArticle
 *
 */
export interface CreateTagsForArticleInput {
  articleId: string;
  tags: string[];
}

export type CreateTagsForArticleOutput = Promise<void>;

/**
 *
 * function: getTagsByArticleIds
 *
 */
export interface GetTagsByArticleIdsInput {
  articleIds: string[];
}

export type GetTagsByArticleIdsOutput = Promise<Dictionary<DbDtoArticleTag[]>>;

/**
 *
 * function: updateArticleById
 *
 */
export interface UpdateArticleByIdInput {
  id: string;
  title?: string;
  slug?: string;
  description?: string;
  body?: string;
}

export type UpdateArticleByIdOutput = Promise<void>;

/**
 *
 * function: getArticles
 *
 */
export interface ArticleFilters {
  ids?: string[];
  slugs?: string[];
  tags?: string[];
  author?: string;
  favorited?: string;
  followedBy?: string;
  requestingUserId?: string;
}

export type GetArticlesInput = ArticleFilters & {
  limit?: number;
  offset?: number;
};

export type GetArticlesOutput = Promise<DbDtoArticle[]>;

/**
 *
 * function: countArticles
 *
 */
export type CountArticlesInput = ArticleFilters;

export type CountArticlesOutput = Promise<number>;

/**
 *
 * function: deleteArticleById
 *
 */
export interface DeleteArticleByIdInput {
  id: string;
}

export type DeleteArticleByIdOutput = Promise<void>;

/**
 *
 * function: createArticleComment
 *
 */
export interface CreateArticleCommentInput {
  articleId: string;
  userId: string;
  body: string;
}

export type CreateArticleCommentOutput = Promise<string>;

/**
 *
 * function: getArticleQueryByFilters
 *
 */
export type GetArticleQueryByFiltersInput = ArticleFilters;

export type GetArticleQueryByFiltersOutput = Knex.QueryBuilder;

/**
 *
 * function: deleteArticleCommentById
 *
 */
export interface DeleteArticleCommentByIdInput {
  id: string;
}

export type DeleteArticleCommentByIdOutput = Promise<void>;

/**
 *
 * function: getAvailableTags
 *
 */
export type GetAvailableTagsOutput = Promise<string[]>;

/**
 *
 * function: getArticleCommentsByArticleId
 *
 */
export interface GetArticleCommentsByArticleIdInput {
  articleId: string;
  limit: number;
  offset: number;
  requestingUserId?: string;
}

export type GetArticleCommentsByArticleIdOutput = Promise<
  DbDtoArticleCommentWithProfile[]
>;

/**
 *
 * function: countArticleCommentsByArticleId
 *
 */
export interface CountArticleCommentsByArticleIdInput {
  articleId: string;
}

export type CountArticleCommentsByArticleIdOutput = Promise<number>;

/**
 *
 * function: getArticleCommentsByIds
 *
 */
export interface GetArticleCommentsByIdsInput {
  ids: string[];
  requestingUserId?: string;
}

export type GetArticleCommentsByIdsOutput = Promise<DbDtoArticleComment[]>;

/**
 *
 * function: favoriteArticle
 *
 */
export interface FavoriteArticleInput {
  articleId: string;
  userId: string;
}

export type FavoriteArticleOutput = Promise<void>;

/**
 *
 * function: unfavoriteArticle
 *
 */
export interface UnfavoriteArticleInput {
  articleId: string;
  userId: string;
}

export type UnfavoriteArticleOutput = Promise<void>;
