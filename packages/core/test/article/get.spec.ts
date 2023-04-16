import { expect } from "chai";
import { dangerouslyResetDb } from "../../knex";
import { Factory } from "../../Factory";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";
import { ArticleNotFoundError } from "../../service/article/error";

describe("Article - Get Specific Article", () => {
	it("should be able to get the details of an article by slug", async () => {
		const {
			articleService,
			article
		} = await setup();
		const articleGetBySlug = await articleService.getArticleBySlug({ slug: article.slug });
		expect(article.id).equals(articleGetBySlug.id);
	});

	it("should throw an error if the article does not exist", async () => {
		const { articleService } = await setup();
		try {
			await articleService.getArticleBySlug({ slug: "RANDOM_SLUG" });
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
	const article = await articleService.createArticle(getCreateArticleInput({ userId: user.id }));
	return {
		articleService,
		user,
		article
	};
};
