import { type DbDtoArticleComment } from "../../../database/dto";
import {
	type CountArticleCommentsByArticleIdInput,
	type GetArticleCommentByIdInput,
	type GetArticleCommentIdsByArticleIdInput,
	type GetArticleCommentsByArticleIdInput,
	type GetArticleCommentsByIdsInput,
	type RepoArticle
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class GetArticleCommentsHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: GetArticleCommentsHandlerConstructor) {
		this.repoArticle = repoArticle;
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
		const comments = await this.repoArticle.getArticleCommentsByArticleId({
			articleId
		});
		return comments;
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
	}: GetArticleCommentByIdInput): Promise<DbDtoArticleComment | undefined> {
		const comment = await this.repoArticle.getArticleCommentById({ id });
		return comment;
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
		const comments = await this.repoArticle.getArticleCommentsByIds({
			ids
		});
		return comments;
	}

	/**
	 *
	 * Gets the comments of an article, given the article ID
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
		await this.validateArticle({ articleId });
		const comments = await this.repoArticle.getArticleCommentsByArticleId({
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
		await this.validateArticle({ articleId });
		const count = await this.repoArticle.countArticleCommentsByArticleId({
			articleId
		});
		return count;
	}

	/**
	 *
	 * Validates that an article with the given ID exists.
	 *
	 * @private
	 * @async
	 * @function validateArticle
	 *
	 * @param {Object} params - An object containing the ID of the article to validate.
	 * @param {string} params.articleId - The ID of the article to validate.
	 *
	 * @returns {Promise<void>} A Promise that resolves with no value if the article exists, or rejects with an error if it does not.
	 * @throws {ArticleNotFoundError} If the article with the given ID does not exist.
	 *
	 */
	private async validateArticle({
		articleId
	}: {
		articleId: string;
	}): Promise<void> {
		const article = await this.repoArticle.getArticleById({
			id: articleId
		});
		if (!article) {
			throw new ArticleNotFoundError({});
		}
	}
}

interface GetArticleCommentsHandlerConstructor {
	repoArticle: RepoArticle;
}

export {
	GetArticleCommentsByIdsInput,
	GetArticleCommentByIdInput,
	GetArticleCommentIdsByArticleIdInput,
	CountArticleCommentsByArticleIdInput,
	GetArticleCommentsByArticleIdInput
} from "../../../repository/RepoArticle";
