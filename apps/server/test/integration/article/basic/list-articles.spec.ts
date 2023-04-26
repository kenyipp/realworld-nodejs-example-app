import { expect } from "chai";
import supertest, { Response } from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - List Articles", () => {
	it("should be able to retrieve a list of all articles", async () => {
		const { articles } = await setup();
		const totalArticleCount = Object.keys(articles).length;

		const response = await request.get(ServerPath.ListArticles).send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(totalArticleCount);
		expect(response.body.articlesCount).equals(totalArticleCount);
	});

	it("should be able to retrieve a list of all articles with access token", async () => {
		const { authors, articles } = await setup();
		const totalArticleCount = Object.keys(articles).length;
		const { accessToken } = signJsonWebToken({
			dbDtoUser: authors.authorA
		});

		const response: Response = await request
			.get(ServerPath.ListArticles)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(totalArticleCount);
		expect(response.body.articlesCount).equals(totalArticleCount);
	});

	it("should be able to retrieve a list of articles filtered by tag", async () => {
		await setup();
		let response: Response | null = null;

		response = await request
			.get(ServerPath.ListArticles)
			.query({ tag: "TAG_A" })
			.send();
		expect(response.status).equals(200);
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(2);
		expect(response.body.articlesCount).equals(2);

		response = await request
			.get(ServerPath.ListArticles)
			.query({ tag: "TAG_B" })
			.send();

		expect(response.status).equals(200);
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(1);
		expect(response.body.articlesCount).equals(1);
	});

	it("should be able to retrieve a list of articles filtered by author", async () => {
		const { authors } = await setup();

		const response: Response = await request
			.get(ServerPath.ListArticles)
			.query({ author: authors.authorA.username })
			.send();

		expect(response.status).equals(200);
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(2);
		expect(response.body.articlesCount).equals(2);
	});

	it("should be able to retrieve a list of articles filtered by limit and offset", async () => {
		const { articles } = await setup();
		const totalArticleCount = Object.keys(articles).length;

		const response = await request
			.get(ServerPath.ListArticles)
			.query({ limit: 1, offset: 0 })
			.send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(1);
		expect(response.body.articlesCount).equals(totalArticleCount);
	});

	it("should return a status code of 422 - Unprocessable Entity if the client provides non-number parameters to offset and limit", async () => {
		await setup();
		const response = await request
			.get(ServerPath.ListArticles)
			.query({ limit: "limit", offset: "offset" })
			.send();
		expect(response.status).equals(422);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const authorA = await userService.createUser(getCreateUserInput({}));
	const authorB = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const articleAWithTagFromAuthorA = await articleService.createArticle(
		getCreateArticleInput({ userId: authorA.id })
	);
	await articleService.createArticleTag({
		articleId: articleAWithTagFromAuthorA.id,
		tagList: ["TAG_A", "TAG_B"]
	});
	const articleBFromAuthorA = await articleService.createArticle(
		getCreateArticleInput({ userId: authorA.id })
	);
	const articleCFromAuthorB = await articleService.createArticle(
		getCreateArticleInput({ userId: authorB.id })
	);
	const articleDWithTagFromAuthorB = await articleService.createArticle(
		getCreateArticleInput({ userId: authorB.id })
	);
	await articleService.createArticleTag({
		articleId: articleDWithTagFromAuthorB.id,
		tagList: ["TAG_A"]
	});
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		articleService,
		authors: {
			authorA,
			authorB
		},
		user,
		accessToken,
		articles: {
			articleAWithTagFromAuthorA,
			articleBFromAuthorA,
			articleCFromAuthorB,
			articleDWithTagFromAuthorB
		}
	};
};
