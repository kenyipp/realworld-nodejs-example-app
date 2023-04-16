import { BaseError } from "@conduit/utils";
import { ErrorCodes } from "../ArticleConstants";

export class ArticleNotYetFavoritedError extends BaseError {

	constructor({ userId, articleId }: ArticleNotYetFavoritedErrorConstructor) {
		super({
			code: ErrorCodes.ArticleNotYetFavorited,
			message: "Article is not yet favorited by the user",
			details: [
				userId,
				articleId
			]
		});
	}

}

interface ArticleNotYetFavoritedErrorConstructor {
	userId: string;
	articleId: string;
}
