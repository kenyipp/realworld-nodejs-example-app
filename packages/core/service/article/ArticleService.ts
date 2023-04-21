import {
	type DbDtoArticle,
	type DbDtoArticleComment,
	type DbDtoArticleMeta,
	DbDtoArticleTag
} from "../../database/dto";
import {
	GetArticleCommentsByArticleIdInput,
	type IsArticleFavoritedInput,
	type RepoArticle
} from "../../repository/RepoArticle";
import {
	type CountArticleCommentsByArticleIdInput,
	type CountArticlesByFiltersInput,
	CreateArticleCommentHandler,
	type CreateArticleCommentInput,
	CreateArticleHandler,
	type CreateArticleInput,
	CreateArticleTagHandler,
	type CreateArticleTagInput,
	type DeleteArticleBySlugInput,
	type DeleteArticleCommentByIdInput,
	DeleteArticleCommentHandler,
	DeleteArticleHandler,
	FavoriteArticleHandler,
	type FavoriteArticleInput,
	type GetArticleByIdInput,
	type GetArticleBySlugInput,
	type GetArticleCommentByIdInput,
	type GetArticleCommentIdsByArticleIdInput,
	type GetArticleCommentsByIdsInput,
	GetArticleCommentsHandler,
	GetArticleHandler,
	type GetArticleIdsByFiltersInput,
	type GetArticleMetaByIdInput,
	type GetArticleMetaByIdsInput,
	GetArticleMetaHandler,
	GetArticleTagHandler,
	type GetArticlesByIdsInput,
	type GetTagsByArticleIdInput,
	type GetTagsByArticleIdsInput,
	type UnfavoriteArticleInput,
	type UpdateArticleByIdInput,
	UpdateArticleHandler
} from "./implementation";

export class ArticleService {
	private repoArticle: RepoArticle;
	private getArticleHandler: GetArticleHandler;
	private createArticleHandler: CreateArticleHandler;
	private createArticleTagHandler: CreateArticleTagHandler;
	private updateArticleHandler: UpdateArticleHandler;
	private deleteArticleHandler: DeleteArticleHandler;
	private getArticleTagHandler: GetArticleTagHandler;
	private createArticleCommentHandler: CreateArticleCommentHandler;
	private deleteArticleCommentHandler: DeleteArticleCommentHandler;
	private getArticleCommentsHandler: GetArticleCommentsHandler;
	private favoriteArticleHandler: FavoriteArticleHandler;
	private getArticleMetaHandler: GetArticleMetaHandler;

	constructor({ repoArticle }: ArticleServiceConstructor) {
		this.repoArticle = repoArticle;
		this.getArticleHandler = new GetArticleHandler({ repoArticle });
		this.createArticleHandler = new CreateArticleHandler({ repoArticle });
		this.createArticleTagHandler = new CreateArticleTagHandler({
			repoArticle
		});
		this.updateArticleHandler = new UpdateArticleHandler({ repoArticle });
		this.deleteArticleHandler = new DeleteArticleHandler({ repoArticle });
		this.getArticleTagHandler = new GetArticleTagHandler({ repoArticle });
		this.createArticleCommentHandler = new CreateArticleCommentHandler({
			repoArticle
		});
		this.deleteArticleCommentHandler = new DeleteArticleCommentHandler({
			repoArticle
		});
		this.getArticleCommentsHandler = new GetArticleCommentsHandler({
			repoArticle
		});
		this.favoriteArticleHandler = new FavoriteArticleHandler({
			repoArticle
		});
		this.getArticleMetaHandler = new GetArticleMetaHandler({ repoArticle });
	}

	/**
	 *
	 * Executes the creation of a new article with the provided input parameters.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input containing the information required to create the article.
	 * @param {string} input.title - The title of the article.
	 * @param {string} input.description - The description of the article.
	 * @param {string} input.body - The body of the article.
	 * @param {string} input.userId - The ID of the user creating the article.
	 *
	 * @returns {Promise<DbDtoArticle>} - The newly created article object.
	 * @throws {ArticleTitleAlreadyTakenError} - If an article with the same title already exists.
	 *
	 */
	async createArticle(input: CreateArticleInput): Promise<DbDtoArticle> {
		const article = await this.createArticleHandler.execute(input);
		return article;
	}

	/**
	 *
	 * Associates a list of tags with an article in the database.
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to associate the tags with.
	 * @param {string[]} input.tagList - An array of strings representing the tags to associate with the article.
	 *
	 * @throws {ArticleNotFoundError} - If no article with the given ID is found in the database.
	 *
	 */
	async createArticleTag(input: CreateArticleTagInput): Promise<void> {
		await this.createArticleTagHandler.execute(input);
	}

	/**
	 *
	 * Retrieves an article by ID.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the article ID.
	 * @param {number} input.id - The ID of the article to retrieve.
	 *
	 * @throws {ArticleNotFoundError} If the targeted article is not found.
	 * @returns {Promise<object>} A Promise that resolves to the retrieved article object.
	 *
	 */
	async getTagsByArticleId(
		input: GetTagsByArticleIdInput
	): Promise<DbDtoArticleTag> {
		const tag = await this.getArticleTagHandler.getTagsByArticleId(input);
		return tag;
	}

	/**
	 *
	 * Retrieves the tags associated with the given article IDs.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the article IDs.
	 * @param {string[]} input.articleIds - An array of article IDs.
	 *
	 * @returns {Promise<DbDtoArticleTag[]>} A promise that resolves to an array of DbDtoArticleTag objects, each containing an article ID and its associated tags.
	 *
	 */
	async getTagsByArticleIds(
		input: GetTagsByArticleIdsInput
	): Promise<DbDtoArticleTag[]> {
		const tags = await this.getArticleTagHandler.getTagsByArticleIds(input);
		return tags;
	}

	/**
	 *
	 * Update an article by its ID with the provided information.
	 *
	 * @async
	 * @function
	 *
	 * @param {UpdateArticleByIdInput} input - The input data.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of this operation.
	 * @throws {ArticleNotFoundError} If the article with the given ID is not found.
	 * @throws {ArticleTitleAlreadyTakenError} If the new title is already taken by another article.
	 *
	 */
	async updateArticle(input: UpdateArticleByIdInput): Promise<void> {
		await this.updateArticleHandler.execute(input);
	}

	/**
	 *
	 * Retrieves an article by ID.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the article ID.
	 * @param {number} input.id - The ID of the article to retrieve.
	 *
	 * @throws {ArticleNotFoundError} - Throws an error if the specified article does not exist.
	 * @returns {Promise<object>} A Promise that resolves to the retrieved article object.
	 *
	 */
	async getArticleById({ id }: GetArticleByIdInput): Promise<DbDtoArticle> {
		const article = await this.getArticleHandler.getArticleById({ id });
		return article;
	}

	/**
	 *
	 * Retrieves articles by their IDs.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the IDs of the articles to retrieve.
	 * @param {number[]} input.ids - An array of article IDs to retrieve.
	 *
	 * @returns {Promise<object[]>} A Promise that resolves to an array of retrieved article objects.
	 *
	 */
	async getArticlesByIds({
		ids
	}: GetArticlesByIdsInput): Promise<DbDtoArticle[]> {
		const articles = await this.getArticleHandler.getArticlesByIds({ ids });
		return articles;
	}

	/**
	 *
	 * Retrieves a list of articles that match the specified filters.
	 *
	 * @async
	 * @function getArticlesByFilter
	 *
	 * @param {GetArticleIdsByFiltersInput} input - An object containing the filters to apply to the query.
	 *
	 * @returns {Promise<DbDtoArticle[]>} A Promise that resolves with an array of articles that match the specified filters.
	 *
	 */
	async getArticlesByFilters(
		input: GetArticleIdsByFiltersInput
	): Promise<DbDtoArticle[]> {
		const articles = await this.getArticleHandler.getArticlesByFilters(
			input
		);
		return articles;
	}

	/**
	 *
	 * Counts the number of articles that match the given filters.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} filters - The filters to apply to the search.
	 *
	 * @returns {Promise<number>} - The number of articles that match the filters.
	 *
	 */
	async countArticles(filters: CountArticlesByFiltersInput): Promise<number> {
		const count = await this.getArticleHandler.countArticles(filters);
		return count;
	}

	/**
	 *
	 * Retrieves an article from the database by its slug.
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.slug - The slug of the article to retrieve.
	 *
	 * @returns {Promise<DbDtoArticle>} - A promise that resolves to the article retrieved from the database.
	 * @throws {ArticleNotFoundError} - If no article with the given slug is found in the database.
	 *
	 */
	async getArticleBySlug({
		slug
	}: GetArticleBySlugInput): Promise<DbDtoArticle> {
		const article = await this.getArticleHandler.getArticleBySlug({ slug });
		return article;
	}

	/**
	 *
	 * Deletes an article from the database by its slug.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the slug of the article to be deleted.
	 *
	 * @throws {ArticleNotFoundError} - Throws an error if the specified article does not exist.
	 * @throws {Error} - Throws an error if there is an issue with deleting the article.
	 * @returns {Promise<void>} - A Promise that resolves with no value upon successful deletion of the article.
	 *
	 */
	async deleteArticleBySlug({
		slug
	}: DeleteArticleBySlugInput): Promise<void> {
		await this.deleteArticleHandler.deleteArticleBySlug({ slug });
	}

	/**
	 *
	 * Executes the creation of an article comment and returns the created comment object.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} params - An object containing the parameters necessary to create the article comment.
	 * @param {string} params.articleId - The ID of the article the comment belongs to.
	 * @param {string} params.body - The body text of the comment.
	 * @param {string} params.userId - The ID of the user creating the comment.
	 *
	 * @returns {Promise<DbDtoArticleComment>} A Promise that resolves to the created article comment object.
	 * @throws {ArticleNotFoundError} If the article with the given ID does not exist.
	 *
	 */
	async createArticleComment({
		articleId,
		body,
		userId
	}: CreateArticleCommentInput): Promise<DbDtoArticleComment> {
		const comment = await this.createArticleCommentHandler.execute({
			articleId,
			body,
			userId
		});
		return comment;
	}

	/**
	 *
	 * Retrieves an article comment by its ID.
	 *
	 * @async
	 * @function getArticleCommentById
	 *
	 * @param {Object} params - An object containing the ID of the article comment to retrieve.
	 * @param {string} params.id - The ID of the article comment to retrieve.
	 *
	 * @returns {Promise<DbDtoArticleComment>} A Promise that resolves to an article comment object.
	 *
	 */
	async getArticleCommentById({
		id
	}: GetArticleCommentByIdInput): Promise<DbDtoArticleComment> {
		const comment =
			await this.getArticleCommentsHandler.getArticleCommentById({ id });
		return comment;
	}

	/**
	 *
	 * Deletes an article comment with the given ID, after validating that the associated article exists.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} params - An object containing the ID of the article comment to delete and the ID of the associated article.
	 * @param {string} params.id - The ID of the article comment to delete.
	 *
	 * @returns {Promise<void>} A Promise that resolves with no value.
	 * @throws {ArticleCommentNotFoundError} If the article comment with the given ID does not exist.
	 *
	 */
	async deleteArticleComment({
		id
	}: DeleteArticleCommentByIdInput): Promise<void> {
		await this.deleteArticleCommentHandler.execute({ id });
	}

	/**
	 *
	 * Retrieves article comments for a given article ID.
	 *
	 * @async
	 * @function getArticleCommentsByArticleId
	 *
	 * @param {Object} input - The input object containing the article ID.
	 * @param {number} input.articleId - The ID of the article to retrieve comments for.
	 *
	 * @returns {Promise<DbDtoArticleComment[]>} A promise that resolves with an array of database DTOs representing the article comments.
	 * @throws {Error} If the database query fails for any reason.
	 *
	 */
	async getArticleCommentsById({
		articleId
	}: GetArticleCommentsByArticleIdInput): Promise<DbDtoArticleComment[]> {
		const comments =
			await this.getArticleCommentsHandler.getArticleCommentsById({
				articleId
			});
		return comments;
	}

	/**
	 *
	 * Retrieves an array of article comments by their IDs.
	 *
	 * @async
	 * @function getArticleCommentsByIds
	 *
	 * @param {Object} params - An object containing the IDs of the article comments to retrieve.
	 * @param {string[]} params.ids - An array of article comment IDs to retrieve.
	 *
	 * @returns {Promise<DbDtoArticleComment[]>} A Promise that resolves to an array of article comment objects.
	 *
	 */
	async getArticleCommentsByIds({
		ids
	}: GetArticleCommentsByIdsInput): Promise<DbDtoArticleComment[]> {
		const comments =
			await this.getArticleCommentsHandler.getArticleCommentsByIds({
				ids
			});
		return comments;
	}

	/**
	 *
	 * Gets the comments of an article, given the article ID.
	 *
	 * @async
	 * @function getArticleComments
	 *
	 * @param {Object} input - An object containing the article ID.
	 * @param {string} input.articleId - The ID of the article to get comments for.
	 *
	 * @returns {Promise<DbDtoArticleComment[]>} A Promise that resolves with an array of comments for the article.
	 * @throws {ArticleNotFoundError} If the article with the given ID does not exist.
	 *
	 */
	async getArticleComments({
		articleId
	}: GetArticleCommentIdsByArticleIdInput): Promise<DbDtoArticleComment[]> {
		const comments =
			await this.getArticleCommentsHandler.getArticleComments({
				articleId
			});
		return comments;
	}

	/**
	 *
	 * Counts the number of comments for a given article ID.
	 *
	 * @async
	 * @function countArticleCommentsByArticleId
	 *
	 * @param {Object} params - An object containing the parameters for counting the comments.
	 * @param {string} params.articleId - The ID of the article for which to count the comments.
	 *
	 * @returns {Promise<number>} A Promise that resolves to the number of comments for the given article ID.
	 *
	 */
	async countArticleCommentsByArticleId({
		articleId
	}: CountArticleCommentsByArticleIdInput): Promise<number> {
		const count =
			await this.getArticleCommentsHandler.countArticleCommentsByArticleId(
				{ articleId }
			);
		return count;
	}

	/**
	 *
	 * Check if a user has favorited an article.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to check.
	 * @param {string} input.userId - The ID of the user to check.
	 *
	 * @returns {Promise<boolean>} Promise object representing whether the user has favorited the article or not.
	 *
	 */
	async isArticleFavorited({
		articleId,
		userId
	}: IsArticleFavoritedInput): Promise<boolean> {
		const isFavorited = await this.repoArticle.isArticleFavorited({
			articleId,
			userId
		});
		return isFavorited;
	}

	/**
	 *
	 * Add a user's favorite article to the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to favorite.
	 * @param {string} input.userId - The ID of the user who is favoriting the article.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of the database operation.
	 *
	 */
	async favorite({ userId, articleId }: FavoriteArticleInput): Promise<void> {
		await this.favoriteArticleHandler.favorite({ userId, articleId });
	}

	/**
	 *
	 * Remove a user's favorite article from the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to unfavorite.
	 * @param {string} input.userId - The ID of the user who is unfavoriting the article.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of the database operation.
	 *
	 */
	async unfavorite({
		userId,
		articleId
	}: UnfavoriteArticleInput): Promise<void> {
		await this.favoriteArticleHandler.unfavorite({ userId, articleId });
	}

	/**
	 *
	 * Retrieves metadata for a single article based on its ID
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the following:
	 * @param {number} input.id - The ID of the article to retrieve metadata for
	 * @param {number} input.userId - The ID of the user retrieving the metadata
	 *
	 * @returns {Promise<DbDtoArticleMeta>} A Promise that resolves to an DbDtoArticleMeta object
	 * @throws {Error} If an error occurs while retrieving the metadata
	 *
	 */
	async getArticleMetaById({
		id,
		userId
	}: GetArticleMetaByIdInput): Promise<DbDtoArticleMeta> {
		const meta = await this.getArticleMetaHandler.getArticleMetaById({
			id,
			userId
		});
		return meta;
	}

	/**
	 *
	 * Retrieves metadata for articles based on their IDs
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the following:
	 * @param {Array<number>} input.ids - The IDs of the articles to retrieve metadata for
	 * @param {number} input.userId - The ID of the user retrieving the metadata
	 *
	 * @returns {Promise<DbDtoArticleMeta[]>} A Promise that resolves to an DbDtoArticleMeta object
	 * @throws {Error} If an error occurs while retrieving the metadata
	 *
	 */
	async getArticleMetaByIds({
		ids,
		userId
	}: GetArticleMetaByIdsInput): Promise<DbDtoArticleMeta[]> {
		const meta = await this.getArticleMetaHandler.getArticleMetaByIds({
			ids,
			userId
		});
		return meta;
	}

	/**
	 *
	 * Retrieves all distinct tags associated with articles that have normal record status.
	 *
	 * @async
	 * @function
	 *
	 * @returns {Promise<string[]>} - An array of distinct tags.
	 *
	 */
	async getAllTags(): Promise<string[]> {
		const tags = await this.repoArticle.getAllTags();
		return tags;
	}
}

interface ArticleServiceConstructor {
	repoArticle: RepoArticle;
}
