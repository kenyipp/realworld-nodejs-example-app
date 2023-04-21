import {
	DbDtoArticleMeta,
	DbDtoArticleTag,
	DbDtoUser
} from "@conduit/core/database/dto";
import { ArticleService } from "@conduit/core/service";
import { ArticleTitleAlreadyTakenError } from "@conduit/core/service/article/error";
import {
	APIErrorConflict,
	APIErrorInternalServerError,
	logger
} from "@conduit/utils";

import { DtoInputCreateArticle } from "../dto";
import { DtoArticle } from "../dto/DtoArticle";

export class APICreateArticle {
	private articleService: ArticleService;

	constructor({ articleService }: APICreateArticleConstructor) {
		this.articleService = articleService;
	}

	async execute({
		input,
		user
	}: APICreateArticleInput): Promise<APICreateArticleOutput> {
		try {
			const article = await this.articleService.createArticle({
				...input,
				userId: user.id
			});
			await this.articleService.createArticleTag({
				articleId: article.id,
				tagList: input.tagList
			});
			const meta: DbDtoArticleMeta = {
				id: article.id,
				favorited: false,
				favoritesCount: 0,
				following: false
			};
			const tag: DbDtoArticleTag = {
				articleId: article.id,
				tags: input.tagList
			};
			const dtoArticle = new DtoArticle({
				article,
				author: user,
				meta,
				tag
			});
			return { article: dtoArticle };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof ArticleTitleAlreadyTakenError) {
			return new APIErrorConflict({
				message: error.message,
				cause: error
			});
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}
}

interface APICreateArticleConstructor {
	articleService: ArticleService;
}

interface APICreateArticleInput {
	input: DtoInputCreateArticle;
	user: DbDtoUser;
}

interface APICreateArticleOutput {
	article: DtoArticle;
}
