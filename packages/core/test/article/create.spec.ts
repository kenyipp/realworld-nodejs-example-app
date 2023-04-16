import { expect } from "chai";
import { dangerouslyResetDb } from "../../knex";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";
import { Factory } from "../../Factory";
import { ArticleTitleAlreadyTakenError } from "../../service/article/error";

describe("Article - Create Article", () => {
	it("should be able to create an article", async () => {
		const {
			user,
			articleService
		} = await setup();
		const input = getCreateArticleInput({ userId: user.id });
		const article = await articleService.createArticle(input);
		expect(article).is.not.null;
	});

	it("should not be able to create article with the same title as an existing article", async () => {
		const {
			user,
			articleService
		} = await setup();
		const input = getCreateArticleInput({ userId: user.id });
		await articleService.createArticle(input);
		try {
			await articleService.createArticle(input);
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(ArticleTitleAlreadyTakenError);
		}
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	return {
		articleService,
		user
	};
};
