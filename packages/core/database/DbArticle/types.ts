import { DbDtoArticle, DbDtoArticleComment, DbDtoArticleMeta, DbDtoArticleTag } from "../dto";

export interface CreateArticleInput {
	title: string;
	slug: string;
	description: string;
	body: string;
	userId: string;
}

export type CreateArticleOutput = Promise<string>;

export interface CreateTagsForArticleInput {
	articleId: string;
	tagList: string[];
}

export type CreateTagsForArticleOutput = Promise<void>;

export interface GetTagsByArticleIdInput {
	articleId: string;
}

export type GetTagsByArticleIdOutput = Promise<DbDtoArticleTag>;

export interface GetTagsByArticleIdsInput {
	articleIds: string[];
}

export type GetTagsByArticleIdsOutput = Promise<DbDtoArticleTag[]>;

export interface UpdateArticleByIdInput {
	id: string;
	title?: string;
	slug?: string;
	description?: string;
	body?: string;
}

export type UpdateArticleByIdOutput = Promise<void>;

export interface GetArticleByIdInput {
	id: string;
}

export type GetArticleByIdOutput = Promise<DbDtoArticle | undefined>;

export interface GetArticleBySlugInput {
	slug: string;
}

export type GetArticleBySlugOutput = Promise<DbDtoArticle | undefined>;

export interface GetArticlesByIdsInput {
	ids: string[];
}

export type GetArticlesByIdsOutput = Promise<DbDtoArticle[]>;

export interface ArticleFilters {
	tag?: string;
	author?: string;
	favorited?: string;
	followedBy?: string;
}

export type GetArticleIdsByFiltersInput = ArticleFilters & {
	limit: number;
	offset: number;
};

export type GetArticleIdsByFiltersOutput = Promise<string[]> ;

export type CountArticlesByFiltersInput = ArticleFilters;

export type CountArticlesByFiltersOutput = Promise<number>;

export interface DeleteArticleByIdInput {
	id: string;
}

export type DeleteArticleByIdOutput = Promise<void> ;

export interface CreateArticleCommentInput {
	articleId: string;
	body: string;
	userId: string;
}

export type CreateArticleCommentOutput = Promise<string>;

export interface GetArticleCommentIdsByArticleIdInput {
	articleId: string;
}

export type GetArticleCommentIdsByArticleIdOutput = Promise<string[]> ;

export interface CountArticleCommentsByArticleIdInput {
	articleId: string;
}

export type CountArticleCommentsByArticleIdOutput = Promise<number>;

export interface GetArticleCommentsByIdsInput {
	ids: string[];
}

export type GetArticleCommentsByIdsOutput = Promise<DbDtoArticleComment[]>;

export interface GetArticleCommentByIdInput {
	id: string;
}

export type GetArticleCommentByIdOutput = Promise<DbDtoArticleComment | undefined>;

export interface DeleteArticleCommentByIdInput {
	id: string;
}

export type DeleteArticleCommentByIdOutput = Promise<void>;

export interface FavoriteArticleInput {
	articleId: string;
	userId: string;
}

export type FavoriteArticleOutput = Promise<void>;

export interface UnfavoriteArticleInput {
	articleId: string;
	userId: string;
}

export type UnfavoriteArticleOutput = Promise<void>;

export interface IsArticleFavoritedInput {
	articleId: string;
	userId: string;
}

export type IsArticleFavoritedOutput = Promise<boolean>;

export interface GetArticleMetaByIdInput {
	id: string;
	userId?: string;
}

export type GetArticleMetaByIdOutput = Promise<DbDtoArticleMeta | undefined>;

export interface GetArticleMetaByIdsInput {
	ids: string[];
	userId?: string;
}

export type GetArticleMetaByIdsOutput = Promise<DbDtoArticleMeta[]>;

export interface GetArticleCommentsByArticleIdInput {
	articleId: string;
}

export type GetArticleCommentsByArticleIdOutput = Promise<DbDtoArticleComment[]>;

export type GetAllTagsOutput = Promise<string[]>;
