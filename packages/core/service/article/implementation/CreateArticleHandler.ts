import slugify from "slugify";
import { ArticleTitleAlreadyTakenError } from "../error";
import { type DbDtoArticle } from "../../../database/dto";
import { type RepoArticle } from "../../../repository/RepoArticle";

export class CreateArticleHandler {

	private repoArticle: RepoArticle;

	constructor({ repoArticle }: CreateArticleHandlerConstructor) {
		this.repoArticle = repoArticle;
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
	async execute({
		title,
		description,
		body,
		userId
	}: CreateArticleInput): Promise<DbDtoArticle> {
		await this.validateIfArticleExist({ title });
		const slug = slugify(title);
		const articleId = await this.repoArticle.createArticle({
			title,
			slug,
			description,
			body,
			userId
		});
		const article = await this.repoArticle.getArticleById({ id: articleId });
		return article;
	}

	/**
	 *
	 * Validates if an article with the given title already exists.
	 *
	 * @async
	 * @function
	 * @private
	 *
	 * @param {ValidateIfArticleExistInput} input - The input containing the title to validate.
	 * @param {string} input.title - The title to validate.
	 * @throws {ArticleTitleAlreadyTakenError} - If an article with the same title already exists.
	 *
	 */
	private async validateIfArticleExist({ title }: ValidateIfArticleExistInput) {
		const slug = slugify(title);
		const article = await this.repoArticle.getArticleBySlug({ slug });
		if (article) {
			throw new ArticleTitleAlreadyTakenError({ title });
		}
	}

}

interface CreateArticleHandlerConstructor {
	repoArticle: RepoArticle;
}

export interface CreateArticleInput {
	title: string;
	description: string;
	body: string;
	userId: string;
}

interface ValidateIfArticleExistInput {
	title: string;
}
