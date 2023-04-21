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

describe("Article - Delete Article", () => {
	it("should be able to delete an article", async () => {
		const { article, accessToken } = await setup();

		let response: Response = null;

		response = await request
			.delete(ServerPath.DeleteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);

		response = await request
			.get(ServerPath.GetArticle.replace(":slug", article.slug))
			.send();

		expect(response.status).equals(404);
	});

	it("should return a status code of 403 - Forbidden if the user tries to delete an article that does not belong to them", async () => {
		const { article, userService } = await setup();

		const user = await userService.createUser(getCreateUserInput({}));
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });

		const response = await request
			.delete(ServerPath.DeleteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(403);
	});

	it("should return a status code of 401 - Unauthorized if the client does not provide auth headers", async () => {
		const { article } = await setup();

		const response: Response = await request
			.delete(ServerPath.DeleteArticle.replace(":slug", article.slug))
			.send();

		expect(response.status).equals(401);
	});

	it("should return a status code of 403 - Forbidden if the user has been banned", async () => {
		const { article, user, userService, accessToken } = await setup();

		await userService.banUserById({ id: user.id });

		const response = await request
			.delete(ServerPath.DeleteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(403);
	});

	it("should return a status code of 404 - Not Found if the user tries to delete a deleted article", async () => {
		const { article, articleService, accessToken } = await setup();

		await articleService.deleteArticleBySlug({ slug: article.slug });

		const response = await request
			.delete(ServerPath.DeleteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(404);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		const { accessToken } = await setup();

		const response = await request
			.delete(
				ServerPath.DeleteArticle.replace(":slug", "NOT_EXIST_ARTICLE")
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(404);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: user.id })
	);
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		articleService,
		user,
		article,
		accessToken
	};
};
