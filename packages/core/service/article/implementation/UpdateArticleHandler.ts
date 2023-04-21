import slugify from "slugify";

import { type RepoArticle } from "../../../repository/RepoArticle";
import { ArticleNotFoundError, ArticleTitleAlreadyTakenError } from "../error";

export class UpdateArticleHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: UpdateArticleHandlerConstructor) {
		this.repoArticle = repoArticle;
	}

	/**
	 *
	 * Update an article by its ID with the provided information.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input data.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of this operation.
	 * @throws {ArticleNotFoundError} If the article with the given ID is not found.
	 * @throws {TitleAlreadyTakenError} If the new title is already taken by another article.
	 *
	 */
	async execute({
		id,
		title,
		description,
		body
	}: UpdateArticleByIdInput): Promise<void> {
		const article = await this.repoArticle.getArticleById({ id });
		if (!article) {
			throw new ArticleNotFoundError({});
		}
		let slug: string;
		if (title && article.title !== title) {
			await this.validateIfArticleExist({ title });
			slug = slugify(title);
		}
		await this.repoArticle.updateArticleById({
			id,
			title,
			slug,
			description,
			body
		});
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
	private async validateIfArticleExist({
		title
	}: ValidateIfArticleExistInput) {
		const slug = slugify(title);
		const article = await this.repoArticle.getArticleBySlug({ slug });
		if (article) {
			throw new ArticleTitleAlreadyTakenError({ title });
		}
	}
}

interface UpdateArticleHandlerConstructor {
	repoArticle: RepoArticle;
}

interface ValidateIfArticleExistInput {
	title: string;
}

export interface UpdateArticleByIdInput {
	id: string;
	title?: string;
	description?: string;
	body?: string;
}
