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

describe("Article - Update Article", () => {
	it("should be able to update the article", async () => {
		const {
			article,
			accessToken
		} = await setup();
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: { body: "HELLO_WORLD" } });
		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;
		const dtoArticle: DtoArticle = response.body.article;
		expect(dtoArticle.body).equals("HELLO_WORLD");
	});

	it("should update the slug to reflect the new title when the title of an article is updated using the API. ", async () => {
		const {
			article,
			accessToken
		} = await setup();
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: { title: "UPDATED_TITLE" } });
		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;
		const dtoArticle: DtoArticle = response.body.article;
		// The slug of the article should be updated
		expect(dtoArticle.slug).not.equals(article.slug);
		expect(dtoArticle.title).equals("UPDATED_TITLE");
	});

	it("should return a status code of 403 - Forbidden if the user tries to update an article that does not belong to them", async () => {
		const {
			user,
			article
		} = await setup();
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: { title: "UPDATED_TITLE" } });
		expect(response.status).equals(403);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		const { article } = await setup();
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", article.slug))
			.send({ article: { title: "UPDATED_TITLE" } });
		expect(response.status).equals(401);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		const { accessToken } = await setup();
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", "NON_EXIST_SLUG"))
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: { body: "HELLO_WORLD" } });
		expect(response.status).equals(404);
	});

	it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide any data fields", async () => {
		const {
			article,
			accessToken
		} = await setup();
		const response = await request
			.put(ServerPath.UpdateArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: {} });
		expect(response.status).equals(422);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const author = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(getCreateArticleInput({ userId: author.id }));
	const { accessToken } = signJsonWebToken({ dbDtoUser: author });
	return {
		userService,
		articleService,
		user,
		author,
		article,
		accessToken
	};
};
