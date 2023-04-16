import { DbDtoUser } from "@conduit/core/database/dto";
import {
	APIErrorInternalServerError,
	APIErrorNotFound,
	logger
} from "@conduit/utils";
import { ArticleNotFoundError } from "@conduit/core/service/article/error";
import type { ArticleService } from "@conduit/core/service";
import {
	DtoComment,
	DtoInputAddComment
} from "../dto";

export class APIAddComments {

	private articleService: ArticleService;

	constructor({ articleService }: APIAddCommentsConstructor) {
		this.articleService = articleService;
	}

	async execute({ input, user, slug }: APIAddCommentsInput): Promise<APIAddCommentsOutput> {
		try {
			const article = await this.articleService.getArticleBySlug({ slug });
			const dbDtoComment = await this.articleService.createArticleComment({
				articleId: article.id,
				body: input.comment,
				userId: user.id
			});
			const comment = new DtoComment({ comment: dbDtoComment, author: user, following: false });
			return { comment };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof ArticleNotFoundError) {
			throw new APIErrorNotFound({ message: error.message, cause: error });
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}

}

interface APIAddCommentsConstructor {
	articleService: ArticleService;
}

interface APIAddCommentsInput {
	input: DtoInputAddComment;
	user: DbDtoUser;
	slug: string;
}

interface APIAddCommentsOutput {
	comment: DtoComment;
}
