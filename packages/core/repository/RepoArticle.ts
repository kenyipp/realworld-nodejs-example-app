import {
	type ArticleFilters,
	type CountArticleCommentsByArticleIdInput,
	type CountArticlesByFiltersInput,
	type CreateArticleCommentInput,
	type CreateArticleInput,
	type CreateTagsForArticleInput,
	type DbArticle,
	type DeleteArticleByIdInput,
	type DeleteArticleCommentByIdInput,
	type FavoriteArticleInput,
	type GetArticleByIdInput,
	type GetArticleBySlugInput,
	type GetArticleCommentByIdInput,
	type GetArticleCommentIdsByArticleIdInput,
	type GetArticleCommentsByArticleIdInput,
	type GetArticleCommentsByIdsInput,
	type GetArticleIdsByFiltersInput,
	type GetArticleMetaByIdInput,
	type GetArticleMetaByIdsInput,
	type GetArticlesByIdsInput,
	type GetTagsByArticleIdInput,
	type GetTagsByArticleIdsInput,
	type IsArticleFavoritedInput,
	type UnfavoriteArticleInput,
	type UpdateArticleByIdInput
} from "../database/DbArticle";
import {
	type DbDtoArticle,
	type DbDtoArticleComment,
	type DbDtoArticleMeta,
	type DbDtoArticleTag
} from "../database/dto";

export class RepoArticle {
	private dbArticle: DbArticle;

	constructor({ dbArticle }: RepoArticleConstructor) {
		this.dbArticle = dbArticle;
	}

	async createArticle(input: CreateArticleInput): Promise<string> {
		const articleId = await this.dbArticle.createArticle(input);
		return articleId;
	}

	async createTagsForArticle(
		input: CreateTagsForArticleInput
	): Promise<void> {
		await this.dbArticle.createTagsForArticle(input);
	}

	async getTagsByArticleIds({
		articleIds
	}: GetTagsByArticleIdsInput): Promise<DbDtoArticleTag[]> {
		const tags = await this.dbArticle.getTagsByArticleIds({ articleIds });
		return tags;
	}

	async getTagsByArticleId({
		articleId
	}: GetTagsByArticleIdInput): Promise<DbDtoArticleTag> {
		const tag = await this.dbArticle.getTagsByArticleId({ articleId });
		return tag;
	}

	async updateArticleById(input: UpdateArticleByIdInput): Promise<void> {
		await this.dbArticle.updateArticleById(input);
	}

	async getArticleById({
		id
	}: GetArticleByIdInput): Promise<DbDtoArticle | undefined> {
		const article = await this.dbArticle.getArticleById({ id });
		return article;
	}

	async getArticleBySlug({
		slug
	}: GetArticleBySlugInput): Promise<DbDtoArticle | undefined> {
		const article = await this.dbArticle.getArticleBySlug({ slug });
		return article;
	}

	async getArticlesByIds({
		ids
	}: GetArticlesByIdsInput): Promise<DbDtoArticle[]> {
		const articles = await this.dbArticle.getArticlesByIds({ ids });
		return articles;
	}

	async getArticleIdsByFilters(
		filters: GetArticleIdsByFiltersInput
	): Promise<string[]> {
		const ids = await this.dbArticle.getArticleIdsByFilters(filters);
		return ids;
	}

	async countArticlesByFilters(
		filters: CountArticlesByFiltersInput
	): Promise<number> {
		const count = await this.dbArticle.countArticlesByFilters(filters);
		return count;
	}

	async deleteArticleById({ id }: DeleteArticleByIdInput): Promise<void> {
		await this.dbArticle.deleteArticleById({ id });
	}

	async createArticleComment({
		articleId,
		body,
		userId
	}: CreateArticleCommentInput): Promise<string> {
		const commentId = await this.dbArticle.createArticleComment({
			articleId,
			body,
			userId
		});
		return commentId;
	}

	async getArticleCommentIdsByArticleId({
		articleId
	}: GetArticleCommentIdsByArticleIdInput): Promise<string[]> {
		const ids = await this.dbArticle.getArticleCommentIdsByArticleId({
			articleId
		});
		return ids;
	}

	async countArticleCommentsByArticleId({
		articleId
	}: CountArticleCommentsByArticleIdInput): Promise<number> {
		const count = await this.dbArticle.countArticleCommentsByArticleId({
			articleId
		});
		return count;
	}

	async getArticleCommentsByIds({
		ids
	}: GetArticleCommentsByIdsInput): Promise<DbDtoArticleComment[]> {
		const comments = await this.dbArticle.getArticleCommentsByIds({ ids });
		return comments;
	}

	async getArticleCommentById({
		id
	}: GetArticleCommentByIdInput): Promise<DbDtoArticleComment | undefined> {
		const comment = await this.dbArticle.getArticleCommentById({ id });
		return comment;
	}

	async deleteArticleCommentById({
		id
	}: DeleteArticleCommentByIdInput): Promise<void> {
		await this.dbArticle.deleteArticleCommentById({ id });
	}

	async favoriteArticle({
		articleId,
		userId
	}: FavoriteArticleInput): Promise<void> {
		await this.dbArticle.favoriteArticle({ articleId, userId });
	}

	async unfavoriteArticle({
		articleId,
		userId
	}: UnfavoriteArticleInput): Promise<void> {
		await this.dbArticle.unfavoriteArticle({ articleId, userId });
	}

	async isArticleFavorited({
		articleId,
		userId
	}: IsArticleFavoritedInput): Promise<boolean> {
		const isFavorited = await this.dbArticle.isArticleFavorited({
			articleId,
			userId
		});
		return isFavorited;
	}

	async getArticleMetaById({
		id,
		userId
	}: GetArticleMetaByIdInput): Promise<DbDtoArticleMeta | undefined> {
		const meta = await this.dbArticle.getArticleMetaById({ id, userId });
		return meta;
	}

	async getArticleMetaByIds({
		ids,
		userId
	}: GetArticleMetaByIdsInput): Promise<DbDtoArticleMeta[]> {
		const meta = await this.dbArticle.getArticleMetaByIds({ ids, userId });
		return meta;
	}

	async getArticleCommentsByArticleId({
		articleId
	}: GetArticleCommentsByArticleIdInput): Promise<DbDtoArticleComment[]> {
		const comments = await this.dbArticle.getArticleCommentsByArticleId({
			articleId
		});
		return comments;
	}

	async getAllTags(): Promise<string[]> {
		const tags = await this.dbArticle.getAllTags();
		return tags;
	}
}

interface RepoArticleConstructor {
	dbArticle: DbArticle;
}

export {
	ArticleFilters,
	CreateArticleInput,
	CreateTagsForArticleInput,
	UpdateArticleByIdInput,
	GetArticleByIdInput,
	GetArticleBySlugInput,
	GetArticlesByIdsInput,
	GetArticleIdsByFiltersInput,
	CountArticlesByFiltersInput,
	GetTagsByArticleIdInput,
	GetTagsByArticleIdsInput,
	CreateArticleCommentInput,
	GetArticleCommentIdsByArticleIdInput,
	CountArticleCommentsByArticleIdInput,
	GetArticleCommentsByIdsInput,
	DeleteArticleCommentByIdInput,
	FavoriteArticleInput,
	UnfavoriteArticleInput,
	IsArticleFavoritedInput,
	GetArticleMetaByIdInput,
	GetArticleMetaByIdsInput,
	DbDtoArticleMeta,
	GetArticleCommentByIdInput,
	GetArticleCommentsByArticleIdInput
};
