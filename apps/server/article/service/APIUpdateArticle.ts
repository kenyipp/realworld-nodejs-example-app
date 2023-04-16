import {
	APIError,
	APIErrorForbidden,
	APIErrorNotFound,
	APIErrorInternalServerError,
	APIErrorConflict,
	APIErrorUnprocessableEntity
} from "@conduit/utils/error";
import { logger } from "@conduit/utils";
import { ArticleNotFoundError, ArticleTitleAlreadyTakenError } from "@conduit/core/service/article/error";
import type { DbDtoArticle, DbDtoUser } from "@conduit/core/database/dto";
import type { ArticleService } from "@conduit/core/service";
import pAll from "p-all";
import { Environments } from "@conduit/types/Environments";
import { isNil } from "lodash";
import {
	DtoArticle,
	DtoInputUpdateArticle
} from "../dto";

export class APIUpdateArticle {

	private articleService: ArticleService;

	constructor({ articleService }: APIUpdateArticleConstructor) {
		this.articleService = articleService;
	}

	async execute({ slug, input, user }: APIUpdateArticleInput): Promise<APIUpdateArticleOutput> {
		try {
			const article: DbDtoArticle = await this.articleService.getArticleBySlug({ slug });
			APIErrorForbidden.assert({
				condition: article.userId === user.id,
				message: "You are not able to update article that do not belong to you."
			});
			APIErrorUnprocessableEntity.assert({
				condition: Object.values(input).some((value) => !isNil(value)),
				message: "At least one data field must be provided to update the article."
			});
			await this.articleService.updateArticle({ id: article.id, ...input });
			const updated = await this.getUpdatedArticle({ articleId: article.id, user });
			return { article: updated };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private async getUpdatedArticle({ articleId, user }): Promise<DtoArticle> {
		const [
			article,
			meta,
			tag
		] = await pAll([
			() => this.articleService.getArticleById({ id: articleId }),
			() => this.articleService.getArticleMetaById({ id: articleId, userId: user.id }),
			() => this.articleService.getTagsByArticleId({ articleId })
		], {
			concurrency: process.env.NODE_ENV === Environments.Testing ? 1 : Infinity
		});
		const dtoArticle = new DtoArticle({
			article, meta, tag, author: user
		});
		return dtoArticle;
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		if (error instanceof ArticleNotFoundError) {
			throw new APIErrorNotFound({ message: error.message, cause: error });
		}
		if (error instanceof ArticleTitleAlreadyTakenError) {
			throw new APIErrorConflict({ message: error.message, cause: error });
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}

}

interface APIUpdateArticleConstructor {
	articleService: ArticleService;
}

interface APIUpdateArticleInput {
	slug: string;
	input: DtoInputUpdateArticle;
	user: DbDtoUser;
}

interface APIUpdateArticleOutput {
	article: DtoArticle;
}
