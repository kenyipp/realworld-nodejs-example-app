import { BaseError } from "@conduit/utils";
import { ErrorCodes } from "../ArticleConstants";

export class ArticleAlreadyFavoritedError extends BaseError {

	constructor({ userId, articleId }: ArticleAlreadyFavoritedErrorConstructor) {
		super({
			code: ErrorCodes.ArticleAlreadyFavorited,
			message: "Article is already favorited by the user",
			details: [
				userId,
				articleId
			]
		});
	}

}

interface ArticleAlreadyFavoritedErrorConstructor {
	userId: string;
	articleId: string;
}
