import { expect } from "chai";
import supertest from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { DtoArticle } from "../../../../article/dto";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Favorite Article", () => {
	it("should able to favorite an article", async () => {
		const { userService, article } = await setup();

		const user = await userService.createUser(getCreateUserInput({}));
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });

		const response = await request
			.post(ServerPath.FavoriteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;

		const favoritedArticle: DtoArticle = response.body.article;

		expect(favoritedArticle.favorited).to.be.true;
		expect(favoritedArticle.favoritesCount).equals(1);
	});

	it("should return a status code of 400 - Bad Request if the client has already favorited the targeted article", async () => {
		const { articleService, userService, article } = await setup();

		const user = await userService.createUser(getCreateUserInput({}));
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });

		await articleService.favorite({
			userId: user.id,
			articleId: article.id
		});

		const response = await request
			.post(ServerPath.FavoriteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(400);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		const { article } = await setup();

		const response = await request
			.post(ServerPath.FavoriteArticle.replace(":slug", article.slug))
			.send();

		expect(response.status).equals(401);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		const { userService } = await setup();

		const user = await userService.createUser(getCreateUserInput({}));
		const { accessToken } = signJsonWebToken({ dbDtoUser: user });

		const response = await request
			.post(ServerPath.FavoriteArticle.replace(":slug", "NON_EXIST_SLUG"))
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
