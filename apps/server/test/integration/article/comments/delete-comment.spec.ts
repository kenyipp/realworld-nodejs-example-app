import { faker } from "@faker-js/faker";
import { expect } from "chai";
import supertest from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateCommentInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Delete Comment", () => {
	it("should be able to delete comments from an article", async () => {
		const { article, comment, accessToken } = await setup();

		const response = await request
			.delete(
				ServerPath.DeleteComment.replace(":slug", article.slug).replace(
					":id",
					comment.id
				)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
	});

	it("should return a status code of 403 - Forbidden if user tries to delete comments from an article that do not belong to them", async () => {
		const { userService, article, comment } = await setup();
		const user = await userService.createUser(getCreateUserInput({}));
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });
		const response = await request
			.delete(
				ServerPath.DeleteComment.replace(":slug", article.slug).replace(
					":id",
					comment.id
				)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(403);
	});

	it("should return a status code of 401 - Unauthorized if the client does not provide auth headers", async () => {
		const { article, comment } = await setup();
		const response = await request
			.delete(
				ServerPath.DeleteComment.replace(":slug", article.slug).replace(
					":id",
					comment.id
				)
			)
			.send({
				comment: {
					body: faker.lorem.sentence()
				}
			});
		expect(response.status).equals(401);
	});

	it("should return a status code of 404 - Not Found if the targeted article's comment does not exist", async () => {
		const { article, accessToken } = await setup();
		const response = await request
			.delete(
				ServerPath.DeleteComment.replace(":slug", article.slug).replace(
					":id",
					"NON_EXIST_ID"
				)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				comment: {
					body: faker.lorem.sentence()
				}
			});
		expect(response.status).equals(404);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const author = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: author.id })
	);
	const comment = await articleService.createArticleComment(
		getCreateCommentInput({ articleId: article.id, userId: user.id })
	);
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		articleService,
		user,
		author,
		article,
		comment,
		accessToken
	};
};
