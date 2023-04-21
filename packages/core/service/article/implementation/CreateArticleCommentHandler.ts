import { type DbDtoArticleComment } from "../../../database/dto";
import {
	type CreateArticleCommentInput,
	type RepoArticle
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class CreateArticleCommentHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: CreateArticleCommentHandlerConstructor) {
		this.repoArticle = repoArticle;
	}

	/**
	 *
	 * Executes the creation of an article comment and returns the created comment object.
	 *
	 * @async
	 * @function execute
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
	async execute({
		articleId,
		body,
		userId
	}: CreateArticleCommentInput): Promise<DbDtoArticleComment> {
		await this.validateArticle({ articleId });
		const id = await this.repoArticle.createArticleComment({
			articleId,
			body,
			userId
		});
		const comment = await this.repoArticle.getArticleCommentById({ id });
		return comment;
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

interface CreateArticleCommentHandlerConstructor {
	repoArticle: RepoArticle;
}

export { type CreateArticleCommentInput } from "../../../repository/RepoArticle";
