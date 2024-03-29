import { isNil } from "lodash";
import pAll from "p-all";

import { DbDtoUser } from "@conduit/core/database/dto";
import { ArticleService, UserService } from "@conduit/core/service";
import { ArticleNotFoundError } from "@conduit/core/service/article/error";
import { Environments } from "@conduit/types";
import { logger } from "@conduit/utils";
import {
	APIError,
	APIErrorInternalServerError,
	APIErrorNotFound
} from "@conduit/utils/error";

import { DtoArticle } from "../dto";

export class APIGetArticle {
	private articleService: ArticleService;
	private userService: UserService;

	constructor({ articleService, userService }: APIGetArticleConstructor) {
		this.articleService = articleService;
		this.userService = userService;
	}

	async execute({
		slug,
		user
	}: APIGetArticleInput): Promise<APIGetArticleOutput> {
		try {
			const article = await this.articleService.getArticleBySlug({
				slug
			});
			const [author, meta, tag] = await pAll(
				[
					() => this.userService.getUserById({ id: article.userId }),
					() =>
						this.articleService.getArticleMetaById({
							id: article.id,
							userId: user?.id
						}),
					() =>
						this.articleService.getTagsByArticleId({
							articleId: article.id
						})
				],
				{
					concurrency:
						process.env.NODE_ENV === Environments.Testing
							? 1
							: Infinity
				}
			);

			ArticleNotFoundError.assert({
				condition: !isNil(author),
				message: "Invalid article"
			});

			const dtoArticle = new DtoArticle({
				article,
				author: author!,
				meta,
				tag
			});
			return { article: dtoArticle };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		if (error instanceof ArticleNotFoundError) {
			throw new APIErrorNotFound({
				message: error.message,
				cause: error
			});
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}
}

interface APIGetArticleConstructor {
	articleService: ArticleService;
	userService: UserService;
}

interface APIGetArticleInput {
	slug: string;
	user?: DbDtoUser;
}

interface APIGetArticleOutput {
	article: DtoArticle;
}
