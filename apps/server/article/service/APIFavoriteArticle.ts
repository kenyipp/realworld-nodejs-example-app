import pAll from "p-all";

import { DbDtoArticle, DbDtoUser } from "@conduit/core/database/dto";
import { ArticleService, UserService } from "@conduit/core/service";
import {
	ArticleAlreadyFavoritedError,
	ArticleNotFoundError
} from "@conduit/core/service/article/error";
import { Environments } from "@conduit/types";
import { logger } from "@conduit/utils";
import {
	APIError,
	APIErrorBadRequest,
	APIErrorInternalServerError,
	APIErrorNotFound
} from "@conduit/utils/error";

import { DtoArticle } from "../dto";

export class APIFavoriteArticle {
	private articleService: ArticleService;
	private userService: UserService;

	constructor({
		articleService,
		userService
	}: APIFavoriteArticleConstructor) {
		this.articleService = articleService;
		this.userService = userService;
	}

	async execute({
		slug,
		user
	}: APIFavoriteArticleInput): Promise<APIFavoriteArticleOutput> {
		try {
			const article = await this.articleService.getArticleBySlug({
				slug
			});
			await this.articleService.favorite({
				userId: user.id,
				articleId: article.id
			});
			const dtoArticle = await this.getUpdatedArticle({
				article,
				userId: user.id
			});
			return { article: dtoArticle };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private async getUpdatedArticle({
		article,
		userId
	}: {
		article: DbDtoArticle;
		userId: string;
	}): Promise<DtoArticle> {
		const [author, meta, tag] = await pAll(
			[
				() => this.userService.getUserById({ id: article.userId }),
				() =>
					this.articleService.getArticleMetaById({
						id: article.id,
						userId
					}),
				() =>
					this.articleService.getTagsByArticleId({
						articleId: article.id
					})
			],
			{
				concurrency:
					process.env.NODE_ENV === Environments.Testing ? 1 : Infinity
			}
		);

		const dtoArticle = new DtoArticle({
			article,
			meta,
			tag,
			author
		});
		return dtoArticle;
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		if (error instanceof ArticleNotFoundError) {
			return new APIErrorNotFound({
				message: error.message,
				cause: error
			});
		}
		if (error instanceof ArticleAlreadyFavoritedError) {
			return new APIErrorBadRequest({
				message: error.message,
				cause: error
			});
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}
}

interface APIFavoriteArticleConstructor {
	articleService: ArticleService;
	userService: UserService;
}

interface APIFavoriteArticleInput {
	slug: string;
	user: DbDtoUser;
}

interface APIFavoriteArticleOutput {
	article: DtoArticle;
}
