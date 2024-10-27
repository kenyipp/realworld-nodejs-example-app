import { ArticleService, DbDtoArticle } from '@conduit/core';

import { DtoArticle } from '../../dto';

export interface ApiUpdateArticleConstructor {
  articleService: ArticleService;
}

export interface ApiUpdateArticleInput {
  slug: string;
  userId: string;
  title?: string;
  description?: string;
  body?: string;
}

export type ApiUpdateArticleOutput = Promise<{
  article: DtoArticle;
}>;

/**
 *
 * function: getArticleBySlug
 *
 */
export interface GetArticleBySlugInput {
  slug: string;
}

export type GetArticleBySlugOutput = Promise<DbDtoArticle>;

/**
 *
 * function: validateInput
 *
 */
export interface ValidateInputInput {
  authorId: string;
  userId: string;
  title?: string;
  description?: string;
  body?: string;
}

export type ValidateInputOutput = void;

/**
 *
 * function: getUpdatedArticle
 *
 */
export interface GetUpdatedArticleInput {
  articleId: string;
}

export type GetUpdatedArticleOutput = Promise<DtoArticle>;
