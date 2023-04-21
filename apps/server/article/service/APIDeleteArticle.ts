import { DbDtoUser } from "@conduit/core/database/dto";
import { ArticleService } from "@conduit/core/service";
import { ArticleNotFoundError } from "@conduit/core/service/article/error";
import { logger } from "@conduit/utils";
import {
	APIError,
	APIErrorForbidden,
	APIErrorInternalServerError,
	APIErrorNotFound
} from "@conduit/utils/error";

export class APIDeleteArticle {
	private articleService: ArticleService;

	constructor({ articleService }: APIDeleteArticleConstructor) {
		this.articleService = articleService;
	}

	async execute({ slug, user }: APIDeleteArticleInput): Promise<void> {
		try {
			const article = await this.articleService.getArticleBySlug({
				slug
			});
			APIErrorForbidden.assert({
				condition: article.userId === user.id,
				message:
					"You are not able to delete article that do not belong to you."
			});
			await this.articleService.deleteArticleBySlug({ slug });
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

interface APIDeleteArticleConstructor {
	articleService: ArticleService;
}

interface APIDeleteArticleInput {
	slug: string;
	user: DbDtoUser;
}
