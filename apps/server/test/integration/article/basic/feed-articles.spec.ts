import supertest, { Response } from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { getCreateArticleInput, getCreateUserInput } from "@conduit/core/test/mockData";
import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Feed Articles", () => {
	it("should return an empty array if the user doesn't follow any user", async () => {
		const { accessToken } = await setup();

		const response = await request
			.get(ServerPath.FeedArticles)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(0);
		expect(response.body.articlesCount).equals(0);
	});

	it("should be able to return multiple articles created by followed users, ordered by most recent first", async () => {
		const {
			userService,
			authors,
			user,
			accessToken
		} = await setup();

		await userService.followUser({ followerId: user.id, followingId: authors.authorA.id });
		let response: Response = null;

		response = await request
			.get(ServerPath.FeedArticles)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(2);
		expect(response.body.articlesCount).equals(2);

		await userService.unfollowUser({ followerId: user.id, followingId: authors.authorA.id });

		response = await request
			.get(ServerPath.FeedArticles)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();

		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.articles).instanceOf(Array);
		expect(response.body.articles).have.lengthOf(0);
		expect(response.body.articlesCount).equals(0);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		await setup();

		const response = await request
			.get(ServerPath.FeedArticles)
			.send();

		expect(response.status).equals(401);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const authorA = await userService.createUser(getCreateUserInput({}));
	const authorB = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const articleAWithTagFromAuthorA = await articleService.createArticle(getCreateArticleInput({ userId: authorA.id }));
	await articleService.createArticleTag({ articleId: articleAWithTagFromAuthorA.id, tagList: ["TAG_A", "TAG_B"] });
	const articleBFromAuthorA = await articleService.createArticle(getCreateArticleInput({ userId: authorA.id }));
	const articleCFromAuthorB = await articleService.createArticle(getCreateArticleInput({ userId: authorB.id }));
	const articleDWithTagFromAuthorB = await articleService.createArticle(getCreateArticleInput({ userId: authorB.id }));
	await articleService.createArticleTag({ articleId: articleDWithTagFromAuthorB.id, tagList: ["TAG_A"] });
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
