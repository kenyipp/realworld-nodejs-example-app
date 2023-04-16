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

describe("Article - Unfavorite Article", () => {
	it("should able to unfavorite an article", async () => {
		const {
			article,
			accessToken
		} = await setup();
		const response = await request
			.delete(ServerPath.UnfavoriteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;

		const favoritedArticle: DtoArticle = response.body.article;

		expect(favoritedArticle.favorited).to.be.false;
		expect(favoritedArticle.favoritesCount).equals(0);
	});

	it("should return a status code of 400 - Bad Request if the client does not favorite the targeted article", async () => {
		const {
			articleService,
			author,
			accessToken
		} = await setup();
		const article = await articleService.createArticle(getCreateArticleInput({ userId: author.id }));
		const response = await request
			.delete(ServerPath.UnfavoriteArticle.replace(":slug", article.slug))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(400);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		const { article } = await setup();

		const response = await request
			.delete(ServerPath.UnfavoriteArticle.replace(":slug", article.slug))
			.send();

		expect(response.status).equals(401);
	});

	it("should return a status code of 404 - Not Found if the targeted article does not exist", async () => {
		const { accessToken } = await setup();

		const response = await request
			.delete(ServerPath.UnfavoriteArticle.replace(":slug", "NON_EXIST_SLUG"))
			.set("Authorization", `Bearer ${accessToken}`)
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
	await articleService.favorite({ userId: user.id, articleId: article.id });
	return {
		userService,
		articleService,
		user,
		author,
		article,
		accessToken
	};
};
