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

describe("Article - Get Tags", () => {
	it("should be able to get the tags from article", async () => {
		await setup();
		const response = await request.get(ServerPath.GetTags);
		expect(response.status).equals(200);
		expect(response.body.tags).instanceOf(Array);
		expect(response.body.tags).have.lengthOf(4);
	});

	it("should exclude tags from deleted articles", async () => {
		const { articleService, articleA } = await setup();
		await articleService.deleteArticleBySlug({ slug: articleA.slug });
		const response = await request.get(ServerPath.GetTags);
		expect(response.status).equals(200);
		expect(response.body.tags).instanceOf(Array);
		expect(response.body.tags).have.lengthOf(2);
	});

	it("should not display tags from articles authored by a banned author", async () => {
		const { userService, articleA } = await setup();
		await userService.banUserById({ id: articleA.userId });
		const response = await request.get(ServerPath.GetTags);
		expect(response.status).equals(200);
		expect(response.body.tags).instanceOf(Array);
		expect(response.body.tags).have.lengthOf(0);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	const articleA = await articleService.createArticle(
		getCreateArticleInput({ userId: user.id })
	);
	await articleService.createArticleTag({
		articleId: articleA.id,
		tagList: ["Hello", "World"]
	});
	const articleB = await articleService.createArticle(
		getCreateArticleInput({ userId: user.id })
	);
	await articleService.createArticleTag({
		articleId: articleB.id,
		tagList: ["Foo", "Bar"]
	});
	return {
		articleService,
		userService,
		user,
		articleA,
		articleB,
		accessToken
	};
};
