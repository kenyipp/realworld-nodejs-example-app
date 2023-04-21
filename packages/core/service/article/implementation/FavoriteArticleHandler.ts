import {
	type FavoriteArticleInput,
	type RepoArticle,
	type UnfavoriteArticleInput
} from "../../../repository/RepoArticle";
import {
	ArticleAlreadyFavoritedError,
	ArticleNotYetFavoritedError
} from "../error";

export class FavoriteArticleHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: DeleteArticleHandlerConstructor) {
		this.repoArticle = repoArticle;
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
		const isFavorited = await this.repoArticle.isArticleFavorited({
			articleId,
			userId
		});
		if (isFavorited) {
			throw new ArticleAlreadyFavoritedError({ userId, articleId });
		}
		await this.repoArticle.favoriteArticle({ userId, articleId });
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
		const isFavorited = await this.repoArticle.isArticleFavorited({
			articleId,
			userId
		});
		if (!isFavorited) {
			throw new ArticleNotYetFavoritedError({ userId, articleId });
		}
		await this.repoArticle.unfavoriteArticle({ articleId, userId });
	}
}

interface DeleteArticleHandlerConstructor {
	repoArticle: RepoArticle;
}

export {
	type FavoriteArticleInput,
	type UnfavoriteArticleInput
} from "../../../repository/RepoArticle";
