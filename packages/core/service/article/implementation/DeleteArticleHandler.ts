import { ArticleNotFoundError } from "../error";
import { type RepoArticle } from "../../../repository/RepoArticle";

export class DeleteArticleHandler {

	private repoArticle: RepoArticle;

	constructor({ repoArticle }: DeleteArticleHandlerConstructor) {
		this.repoArticle = repoArticle;
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
	async deleteArticleBySlug({ slug }: DeleteArticleBySlugInput): Promise<void> {
		const article = await this.repoArticle.getArticleBySlug({ slug });
		if (!article) {
			throw new ArticleNotFoundError({ slug });
		}
		await this.repoArticle.deleteArticleById({ id: article.id });
	}

}

interface DeleteArticleHandlerConstructor {
	repoArticle: RepoArticle;
}

export interface DeleteArticleBySlugInput {
	slug: string;
}
