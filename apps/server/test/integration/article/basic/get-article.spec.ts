import supertest from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { getCreateArticleInput, getCreateUserInput } from "@conduit/core/test/mockData";
import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";
import { DtoArticle } from "../../../../article/dto";

const factory = new Factory();
const request = supertest(app);

describe("Article - Get Article", () => {
	it("should be able to get an article", async () => {
		const { article } = await setup();
		const response = await request
			.get(ServerPath.GetArticle.replace(":slug", article.slug))
			.send();
		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;
		const dtoArticle: DtoArticle = response.body.article;
		expect(dtoArticle.slug).equals(article.slug);
	});

	it("should return a status code of 404 - Not Found if the author of the targeted article had been deleted", async () => {
		const {
			articleService,
			article
		} = await setup();
		await articleService.deleteArticleBySlug({ slug: article.slug });
		const response = await request
			.get(ServerPath.GetArticle.replace(":slug", article.slug))
			.send();
		expect(response.status).equals(404);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		await setup();
		const response = await request
			.get(ServerPath.GetArticle.replace(":slug", "NON_EXIST_SLUG"))
			.send();
		expect(response.status).equals(404);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const author = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(getCreateArticleInput({ userId: author.id }));
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		articleService,
		user,
		author,
		article,
		accessToken
	};
};
