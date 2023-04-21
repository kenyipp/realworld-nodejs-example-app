import { expect } from "chai";

import { Factory } from "../../Factory";
import { dangerouslyResetDb } from "../../knex";
import { ArticleNotFoundError } from "../../service/article/error";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - Delete Article", () => {
	it("should be able to delete an article", async () => {
		const { articleService, article } = await setup();
		await articleService.deleteArticleBySlug({ slug: article.slug });
		try {
			await articleService.getArticleById({ id: article.id });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ArticleNotFoundError);
		}
	});

	it("should throw an error if the user tries to delete an article that has already been deleted", async () => {
		const { articleService, article } = await setup();
		await articleService.deleteArticleBySlug({ slug: article.slug });
		try {
			await articleService.deleteArticleBySlug({ slug: article.slug });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ArticleNotFoundError);
		}
	});

	it("should throw an error if the targeted slug is not found", async () => {
		const { articleService } = await setup();
		try {
			await articleService.deleteArticleBySlug({ slug: "RANDOM-SLUG" });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ArticleNotFoundError);
		}
	});

	it("should not be able to retrieve a deleted article", async () => {
		const { articleService, article } = await setup();
		await articleService.deleteArticleBySlug({ slug: article.slug });
		try {
			await articleService.getArticleById({ id: article.id });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ArticleNotFoundError);
		}
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: user.id })
	);
	return {
		articleService,
		user,
		article
	};
};
