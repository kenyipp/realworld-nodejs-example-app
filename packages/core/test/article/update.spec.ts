import slugify from "slugify";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { dangerouslyResetDb } from "../../knex";
import { Factory } from "../../Factory";
import { ArticleTitleAlreadyTakenError } from "../../service/article/error";
import { UpdateArticleByIdInput } from "../../service/article/implementation";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - Update Article", () => {
	it("should be able to update the article", async () => {
		const {
			articleService,
			article
		} = await setup();
		const newTitle = "New Title";
		const input: UpdateArticleByIdInput = {
			id: article.id,
			title: newTitle,
			description: faker.lorem.paragraph(),
			body: faker.lorem.paragraphs(2)
		};
		await articleService.updateArticle(input);
		const updated = await articleService.getArticleById({ id: article.id });
		expect(updated.slug).equals(slugify(newTitle));
		expect(updated.description).equals(input.description);
		expect(updated.body).equals(input.body);
	});

	it("should be able to update specific fields of an article, rather than requiring all fields to be updated", async () => {
		const {
			articleService,
			article
		} = await setup();
		const newTitle = "New Title";
		const input: UpdateArticleByIdInput = {
			id: article.id,
			title: newTitle
		};
		await articleService.updateArticle(input);
		const updated = await articleService.getArticleById({ id: article.id });
		expect(updated.title).equals(newTitle);
		expect(updated.slug).equals(slugify(newTitle));
		expect(updated.description).equals(article.description);
		expect(updated.body).equals(article.body);
	});

	it("should throw an error if the title has already been used by another article", async () => {
		const {
			article: articleA,
			user,
			articleService
		} = await setup();
		const articleB = await articleService.createArticle(getCreateArticleInput({ userId: user.id }));
		const input: UpdateArticleByIdInput = {
			id: articleB.id,
			title: articleA.title
		};
		try {
			await articleService.updateArticle(input);
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
	const article = await articleService.createArticle(getCreateArticleInput({ userId: user.id }));
	return {
		articleService,
		user,
		article
	};
};
