import { BaseError } from "@conduit/utils";

import { ErrorCodes } from "../ArticleConstants";

export class ArticleCommentNotFoundError extends BaseError {
	constructor({ id }: ArticleCommentNotFoundErrorConstructor) {
		super({
			code: ErrorCodes.ArticleCommentNotFound,
			message: "The requested article's comment was not found",
			details: [id]
		});
	}
}

interface ArticleCommentNotFoundErrorConstructor {
	id: string;
}
