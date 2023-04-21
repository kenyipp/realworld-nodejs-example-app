import { isNil } from "lodash";

import { type DbDtoArticle } from "../../../database/dto";
import {
	type CountArticlesByFiltersInput,
	type GetArticleByIdInput,
	type GetArticleBySlugInput,
	type GetArticleIdsByFiltersInput,
	type GetArticlesByIdsInput,
	type RepoArticle
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class GetArticleHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: GetArticleHandlerConstructor) {
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
	 * @throws {ArticleNotFoundError} - Throws an error if the specified article does not exist.
	 * @returns {Promise<object>} A Promise that resolves to the retrieved article object.
	 *
	 */
	async getArticleById({ id }: GetArticleByIdInput): Promise<DbDtoArticle> {
		const article = await this.repoArticle.getArticleById({ id });
		if (isNil(article)) {
			throw new ArticleNotFoundError({});
		}
		return article;
	}

	async getArticleBySlug({
		slug
	}: GetArticleBySlugInput): Promise<DbDtoArticle> {
		const article = await this.repoArticle.getArticleBySlug({ slug });
		if (isNil(article)) {
			throw new ArticleNotFoundError({ slug });
		}
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
		const articles = await this.repoArticle.getArticlesByIds({ ids });
		return articles;
	}

	/**
	 *
	 * Retrieves a list of articles that match the specified filters.
	 *
	 * @async
	 * @function getArticlesByFilters
	 *
	 * @param {GetArticleIdsByFiltersInput} input - An object containing the filters to apply to the query.
	 *
	 * @returns {Promise<DbDtoArticle[]>} A Promise that resolves with an array of articles that match the specified filters.
	 *
	 */
	async getArticlesByFilters(
		input: GetArticleIdsByFiltersInput
	): Promise<DbDtoArticle[]> {
		const ids = await this.repoArticle.getArticleIdsByFilters(input);
		const articles = this.getArticlesByIds({ ids });
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
		const count = await this.repoArticle.countArticlesByFilters(filters);
		return count;
	}
}

interface GetArticleHandlerConstructor {
	repoArticle: RepoArticle;
}

export {
	GetArticleByIdInput,
	GetArticleBySlugInput,
	GetArticlesByIdsInput,
	GetArticleIdsByFiltersInput,
	CountArticlesByFiltersInput
} from "../../../repository/RepoArticle";
