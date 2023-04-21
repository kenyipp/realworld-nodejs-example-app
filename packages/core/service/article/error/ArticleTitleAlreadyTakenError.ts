import { BaseError } from "@conduit/utils";

import { ErrorCodes } from "../ArticleConstants";

export class ArticleTitleAlreadyTakenError extends BaseError {
	constructor({ title }: ArticleTitleAlreadyTakenErrorConstructor) {
		super({
			code: ErrorCodes.ArticleTitleTaken,
			message: `The title "${title}" is already taken. Please choose a different title.`,
			details: [title]
		});
	}
}

interface ArticleTitleAlreadyTakenErrorConstructor {
	title: string;
}
