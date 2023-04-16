import { expect } from "chai";
import { dangerouslyResetDb } from "../../knex";
import { Factory } from "../../Factory";
import { ArticleNotFoundError } from "../../service/article/error";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - Tags", () => {
	it("should be able to create tags for an article", async () => {
		const {
			article,
			articleService
		} = await setup();
		await articleService.createArticleTag({ articleId: article.id, tagList: TAGS });
	});

	it("should be able to return a list of tags for an article", async () => {
		const {
			article,
			articleService
		} = await setup();
		await articleService.createArticleTag({ articleId: article.id, tagList: TAGS });
		const dto = await articleService.getTagsByArticleId({ articleId: article.id });
		expect(dto.tags).have.lengthOf(2);
		expect(dto.tags[0]).equals(TAGS[1]);
		expect(dto.tags[1]).equals(TAGS[0]);
	});

	it("should throw an error when attempting to retrieve tags from an article that has been deleted", async () => {
		const { articleService } = await setup();
		try {
			await articleService.createArticleTag({ articleId: "ARTICLE_ID", tagList: TAGS });
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

const TAGS = ["react.js", "angular.js"];
