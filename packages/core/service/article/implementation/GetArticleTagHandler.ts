import { isNil } from "lodash";
import { DbDtoArticleTag } from "../../../database/dto";
import {
	type RepoArticle,
	type GetTagsByArticleIdInput,
	type GetTagsByArticleIdsInput
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class GetArticleTagHandler {

	private repoArticle: RepoArticle;

	constructor({ repoArticle }: GetArticleTagHandlerConstructor) {
		this.repoArticle = repoArticle;
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
	async getTagsByArticleId({ articleId }: GetTagsByArticleIdInput): Promise<DbDtoArticleTag> {
		const article = await this.repoArticle.getArticleById({ id: articleId });
		if (isNil(article)) {
			throw new ArticleNotFoundError({});
		}
		const tag = await this.repoArticle.getTagsByArticleId({ articleId });
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
	async getTagsByArticleIds({ articleIds }: GetTagsByArticleIdsInput): Promise<DbDtoArticleTag[]> {
		const tags = await this.repoArticle.getTagsByArticleIds({ articleIds });
		return tags;
	}

}

interface GetArticleTagHandlerConstructor {
	repoArticle: RepoArticle;
}

export {
	GetTagsByArticleIdInput,
	GetTagsByArticleIdsInput
} from "../../../repository/RepoArticle";
