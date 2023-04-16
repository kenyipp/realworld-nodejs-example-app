import {
	type RepoArticle,
	type GetArticleMetaByIdInput,
	type GetArticleMetaByIdsInput,
	type DbDtoArticleMeta
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class GetArticleMetaHandler {

	private repoArticle: RepoArticle;

	constructor({ repoArticle }: GetArticleMetaHandlerConstructor) {
		this.repoArticle = repoArticle;
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
	async getArticleMetaById({ id, userId }: GetArticleMetaByIdInput): Promise<DbDtoArticleMeta> {
		const meta = await this.repoArticle.getArticleMetaById({ id, userId });
		if (!meta) {
			throw new ArticleNotFoundError({});
		}
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
	async getArticleMetaByIds({ ids, userId }: GetArticleMetaByIdsInput): Promise<DbDtoArticleMeta[]> {
		const meta = await this.repoArticle.getArticleMetaByIds({ ids, userId });
		return meta;
	}

}

interface GetArticleMetaHandlerConstructor {
	repoArticle: RepoArticle;
}

export {
	GetArticleMetaByIdInput,
	GetArticleMetaByIdsInput,
	DbDtoArticleMeta
};
