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

export interface GetTagsByArticleIdsInput {
	articleIds: string[];
}

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

export interface GetArticleBySlugInput {
	slug: string;
}

export interface GetArticlesByIdsInput {
	ids: string[];
}

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

export type CountArticlesByFiltersInput = ArticleFilters;

export interface DeleteArticleByIdInput {
	id: string;
}

export interface CreateArticleCommentInput {
	articleId: string;
	body: string;
	userId: string;
}

export interface GetArticleCommentIdsByArticleIdInput {
	articleId: string;
}

export interface CountArticleCommentsByArticleIdInput {
	articleId: string;
}

export interface GetArticleCommentsByIdsInput {
	ids: string[];
}

export interface GetArticleCommentByIdInput {
	id: string;
}

export interface DeleteArticleCommentByIdInput {
	id: string;
}

export interface FavoriteArticleInput {
	articleId: string;
	userId: string;
}

export interface UnfavoriteArticleInput {
	articleId: string;
	userId: string;
}

export interface IsArticleFavoritedInput {
	articleId: string;
	userId: string;
}

export interface GetArticleMetaByIdInput {
	id: string;
	userId?: string;
}

export interface GetArticleMetaByIdsInput {
	ids: string[];
	userId?: string;
}

export interface GetArticleCommentsByArticleIdInput {
	articleId: string;
}

export type GetAllTagsOutput = Promise<void>;
