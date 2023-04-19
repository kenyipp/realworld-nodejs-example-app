import { indexToDoc } from "@conduit/utils";
import type { ArticleService, UserService } from "@conduit/core/service";
import { DbDtoUser } from "@conduit/core/database/dto";
import { APIError, APIErrorInternalServerError, APIErrorNotFound } from "@conduit/utils/error";
import { ArticleNotFoundError } from "@conduit/core/service/article/error";
import { logger } from "@conduit/utils/logger";
import pAll from "p-all";
import { Environments } from "@conduit/types/Environments";
import { DtoComment } from "../dto";

export class APIGetComments {

	private articleService: ArticleService;
	private userService: UserService;

	constructor({ articleService, userService }: APIGetCommentsConstructor) {
		this.articleService = articleService;
		this.userService = userService;
	}

	async execute({ slug, user }: APIGetCommentsInput): Promise<APIGetCommentsOutput> {
		try {
			const article = await this.articleService.getArticleBySlug({ slug });
			const comments = await this.articleService.getArticleComments({ articleId: article.id });
			const authorIds = comments.map((comment) => comment.userId);
			const [
				authorIdToAuthors,
				isUsersFollowing
			] = await pAll([
				() => this
					.userService
					.getUserByIds({ ids: authorIds })
					.then((authors) => indexToDoc(authors, "id")),
				() => this
					.userService
					.getIsUsersFollowingByUserId({ followerId: user?.id, followingIds: authorIds })
			], {
				concurrency: process.env.NODE_ENV === Environments.Testing ? 1 : Infinity
			});
			const dtoComments = comments.map((comment) => {
				const author = authorIdToAuthors[comment.userId];
				const following = isUsersFollowing[comment.userId];
				return new DtoComment({ comment, author, following });
			});
			return { comments: dtoComments };
		} catch (error) {
			throw this.convertErrorToAPIError(error);
		}
	}

	private convertErrorToAPIError(error: any) {
		if (error instanceof APIError) {
			return error;
		}
		if (error instanceof ArticleNotFoundError) {
			throw new APIErrorNotFound({ message: error.message, cause: error });
		}
		logger.error(error);
		return new APIErrorInternalServerError({});
	}

}

interface APIGetCommentsConstructor {
	articleService: ArticleService;
	userService: UserService;
}

interface APIGetCommentsInput {
	slug: string;
	user: DbDtoUser;
}

interface APIGetCommentsOutput {
	comments: DtoComment[];
}
