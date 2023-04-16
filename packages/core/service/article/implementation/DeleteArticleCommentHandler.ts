import { RecStatus } from "@conduit/types";
import { ArticleCommentNotFoundError } from "../error";
import { type RepoArticle } from "../../../repository/RepoArticle";

export class DeleteArticleCommentHandler {

	private repoArticle: RepoArticle;

	constructor({ repoArticle }: DeleteArticleCommentHandlerConstructor) {
		this.repoArticle = repoArticle;
	}

	/**
	 *
	 * Deletes an article comment with the given ID, after validating that the associated article exists.
	 *
	 * @async
	 * @function execute
	 *
	 * @param {Object} params - An object containing the ID of the article comment to delete and the ID of the associated article.
	 * @param {string} params.id - The ID of the article comment to delete.
	 *
	 * @returns {Promise<void>} A Promise that resolves with no value.
	 *
	 * @throws {ArticleCommentNotFoundError} If the article comment with the given ID does not exist.
	 *
	 */
	async execute({ id }: DeleteArticleCommentByIdInput): Promise<void> {
		await this.validateArticleComment({ id });
		await this.repoArticle.deleteArticleCommentById({ id });
	}

	/**
	 *
	 * Validates that an article comment with the given ID exists.
	 *
	 * @private
	 * @async
	 * @function validateArticleComment
	 *
	 * @param {Object} params - An object containing the ID of the article comment to validate.
	 * @param {string} params.id - The ID of the article comment to validate.
	 *
	 * @returns {Promise<void>} A Promise that resolves with no value if the article comment exists, or rejects with an error if it does not.
	 * @throws {ArticleCommentNotFoundError} If the article comment with the given ID does not exist.
	 *
	 */
	private async validateArticleComment({ id }: { id: string }): Promise<void> {
		const comment = await this.repoArticle.getArticleCommentById({ id });
		if (!comment || comment.recStatus === RecStatus.Deleted) {
			throw new ArticleCommentNotFoundError({ id });
		}
	}

}

interface DeleteArticleCommentHandlerConstructor {
	repoArticle: RepoArticle;
}

export interface DeleteArticleCommentByIdInput {
	id: string;
}
