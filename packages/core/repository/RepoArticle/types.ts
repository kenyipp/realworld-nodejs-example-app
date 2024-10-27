import {
  DbArticle,
  DbDtoArticle,
  DbDtoArticleComment,
  DbDtoArticleTag
} from '@conduit/core/database';

export interface RepoArticleConstructor {
  dbArticle: DbArticle;
}

export {
  CreateArticleInput,
  CreateArticleOutput,
  CreateTagsForArticleInput,
  CreateTagsForArticleOutput,
  DeleteArticleByIdInput,
  DeleteArticleByIdOutput,
  GetTagsByArticleIdsInput,
  GetTagsByArticleIdsOutput,
  GetAvailableTagsOutput,
  CreateArticleCommentInput,
  CreateArticleCommentOutput,
  UpdateArticleByIdInput,
  UpdateArticleByIdOutput,
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  CountArticleCommentsByArticleIdInput,
  CountArticleCommentsByArticleIdOutput,
  GetArticleCommentsByIdsInput,
  GetArticleCommentsByIdsOutput,
  CountArticlesInput,
  CountArticlesOutput,
  GetArticlesInput,
  GetArticlesOutput,
  FavoriteArticleInput,
  FavoriteArticleOutput,
  UnfavoriteArticleInput,
  UnfavoriteArticleOutput,
  DeleteArticleCommentByIdInput,
  DeleteArticleCommentByIdOutput
} from '@conduit/core/database/DbArticle/types';

/**
 *
 * function: getArticleBySlug
 *
 */
export interface GetArticleBySlugInput {
  slug: string;
  requestingUserId?: string;
}

export type GetArticleBySlugOutput = Promise<DbDtoArticle | undefined>;

/**
 *
 * function: getArticleById
 *
 */
export interface GetArticleByIdInput {
  id: string;
  requestingUserId?: string;
}

export type GetArticleByIdOutput = Promise<DbDtoArticle | undefined>;

/**
 *
 * function: getArticleCommentsById
 *
 */
export interface GetArticleCommentByIdInput {
  id: string;
  requestingUserId?: string;
}

export type GetArticleCommentByIdOutput = Promise<DbDtoArticleComment | undefined>;

/**
 *
 * function: getTagsByArticleIdInput
 *
 */
export interface GetTagsByArticleIdInput {
  articleId: string;
}

export type GetTagsByArticleIdOutput = Promise<DbDtoArticleTag[]>;
