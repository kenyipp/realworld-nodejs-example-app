import { faker } from "@faker-js/faker";
import { expect } from "chai";
import supertest from "supertest";

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

describe("Article - Add Comment to an Article", () => {
	it("should be able to add a comment to the article", async () => {
		const { user, article, accessToken } = await setup();

		const response = await request
			.post(
				ServerPath.AddCommentToAnArticle.replace(":slug", article.slug)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				comment: {
					body: faker.lorem.sentence()
				}
			});

		expect(response.status).equals(200);
		expect(response.body.comment).is.not.null;

		const { comment } = response.body;

		expect(comment.author.following).equals(false);
		expect(comment.author.username).equals(user.username);
	});

	it("should return a status code of 404 - Not Found if the targeted article author is banned", async () => {
		const { userService, author, article, accessToken } = await setup();
		await userService.banUserById({ id: author.id });
		const response = await request
			.post(
				ServerPath.AddCommentToAnArticle.replace(":slug", article.slug)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				comment: {
					body: faker.lorem.sentence()
				}
			});
		expect(response.status).equals(404);
	});

	it("should return a status code of 401 - Unauthorized if the client does not provide auth headers", async () => {
		const { article } = await setup();
		const response = await request
			.post(
				ServerPath.AddCommentToAnArticle.replace(":slug", article.slug)
			)
			.send({
				comment: {
					body: faker.lorem.sentence()
				}
			});
		expect(response.status).equals(401);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		const { accessToken } = await setup();
		const response = await request
			.post(
				ServerPath.AddCommentToAnArticle.replace(
					":slug",
					"NON_EXIST_SLUG"
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

	it("should return a status code of 422 - Unprocessable Entity if the client does not provide the required data fields", async () => {
		const { article, accessToken } = await setup();
		const response = await request
			.post(
				ServerPath.AddCommentToAnArticle.replace(":slug", article.slug)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ comment: {} });

		expect(response.status).equals(422);
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
