import { isNil } from "lodash";
import { ArticleCommentNotFoundError } from "@conduit/core/service/article/error";
import type { ArticleService } from "@conduit/core/service";
import {
	APIError,
	APIErrorForbidden,
	APIErrorInternalServerError,
	APIErrorNotFound
} from "@conduit/utils/error";
import { logger } from "@conduit/utils";
import { DbDtoUser } from "@conduit/core/database/dto";

export class APIDeleteComment {

	private articleService: ArticleService;

	constructor({ articleService }: APIDeleteCommentConstructor) {
		this.articleService = articleService;
	}

	async execute({ commentId, user }: APIDeleteCommentInput): Promise<void> {
		try {
			const comment = await this.articleService.getArticleCommentById({ id: commentId });
			APIErrorNotFound.assert({
				condition: !isNil(comment),
				message: "The requested article's comment was not found."
			});
			APIErrorForbidden.assert({
				condition: user.id === comment.userId,
				message: "You are not able to delete comments that do not belong to you."
			});
			await this.articleService.deleteArticleComment({ id: commentId });
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		if (error instanceof ArticleCommentNotFoundError) {
			throw new APIErrorNotFound({ message: error.message, cause: error });
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}

}

interface APIDeleteCommentConstructor {
	articleService: ArticleService;
}

interface APIDeleteCommentInput {
	commentId: string;
	user: DbDtoUser;
}
