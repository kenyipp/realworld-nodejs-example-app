import {
	type CreateTagsForArticleInput as CreateArticleTagInput,
	type RepoArticle
} from "../../../repository/RepoArticle";
import { ArticleNotFoundError } from "../error";

export class CreateArticleTagHandler {
	private repoArticle: RepoArticle;

	constructor({ repoArticle }: CreateArticleTagHandlerConstructor) {
		this.repoArticle = repoArticle;
	}

	/**
	 *
	 * Associates a list of tags with an article in the database.
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to associate the tags with.
	 * @param {string[]} input.tagList - An array of strings representing the tags to associate with the article.
	 *
	 * @throws {ArticleNotFoundError} - If no article with the given ID is found in the database.
	 *
	 */
	async execute({ articleId, tagList }: CreateArticleTagInput) {
		if (tagList.length < 1) {
			return;
		}
		await this.validateArticle({ articleId });
		await this.repoArticle.createTagsForArticle({ articleId, tagList });
	}

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

interface CreateArticleTagHandlerConstructor {
	repoArticle: RepoArticle;
}

export { CreateTagsForArticleInput as CreateArticleTagInput } from "../../../repository/RepoArticle";
