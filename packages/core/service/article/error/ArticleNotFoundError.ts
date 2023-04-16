import { BaseError } from "@conduit/utils";
import { ErrorCodes } from "../ArticleConstants";

export class ArticleNotFoundError extends BaseError {

	constructor({ slug }: ArticleNotFoundErrorConstructor) {
		super({
			code: ErrorCodes.ArticleNotFound,
			message: "The requested article was not found.",
			details: slug ? [slug] : []
		});
	}

}

interface ArticleNotFoundErrorConstructor {
	slug?: string;
}
