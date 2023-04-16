import { expect } from "chai";
import { dangerouslyResetDb } from "../../knex";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";
import { Factory } from "../../Factory";
import {
	ArticleAlreadyFavoritedError,
	ArticleNotYetFavoritedError
} from "../../service/article/error";

describe("Article - Favorite", () => {
	describe("Favorite an Article", () => {
		it("should be able to favorite an article", async () => {
			const {
				articleService,
				user,
				article
			} = await setup();
			await articleService.favorite({ userId: user.id, articleId: article.id });
			const isFavorited = await articleService.isArticleFavorited({ userId: user.id, articleId: article.id });
			expect(isFavorited).to.be.true;
		});

		it("should throw an error if the user tries to favorite an article that has already been favorited", async () => {
			const {
				articleService,
				user,
				article
			} = await setup();
			await articleService.favorite({ userId: user.id, articleId: article.id });
			const isFavorited = await articleService.isArticleFavorited({ userId: user.id, articleId: article.id });
			expect(isFavorited).to.be.true;
			try {
				await articleService.favorite({ userId: user.id, articleId: article.id });
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(ArticleAlreadyFavoritedError);
			}
		});
	});

	describe("Unfavorite an Article", () => {
		it("should be able to unfavorite an article", async () => {
			const {
				articleService,
				user,
				article
			} = await setup();
			let isFavorited: boolean;
			await articleService.favorite({ userId: user.id, articleId: article.id });
			isFavorited = await articleService.isArticleFavorited({ userId: user.id, articleId: article.id });
			expect(isFavorited).to.be.true;
			await articleService.unfavorite({ userId: user.id, articleId: article.id });
			isFavorited = await articleService.isArticleFavorited({ userId: user.id, articleId: article.id });
			expect(isFavorited).to.be.false;
		});

		it("should throw an error if the user tries to unfavorite an article that has already been unfavorited", async () => {
			const {
				articleService,
				user,
				article
			} = await setup();
			try {
				await articleService.unfavorite({ userId: user.id, articleId: article.id });
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(ArticleNotYetFavoritedError);
			}
		});
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(getCreateArticleInput({ userId: user.id }));
	return {
		articleService,
		user,
		article
	};
};
