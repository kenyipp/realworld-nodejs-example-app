import { expect } from "chai";

import { Factory } from "../../Factory";
import { dangerouslyResetDb } from "../../knex";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - Get Meta", () => {
	it("should be able to retrieve the metadata of an article", async () => {
		const { article, userA, articleService } = await setup();
		const meta = await articleService.getArticleMetaById({
			id: article.id,
			userId: userA.id
		});
		expect(meta.id).equals(article.id);
		expect(meta.favorited).equals(false);
		expect(meta.favoritesCount).equals(0);
		expect(meta.following).equals(false);
	});

	it("should be able to retrieve the metadata of an article without user id", async () => {
		const { article, articleService } = await setup();
		const meta = await articleService.getArticleMetaById({
			id: article.id,
			userId: null
		});
		expect(meta.id).equals(article.id);
		expect(meta.favorited).equals(false);
		expect(meta.favoritesCount).equals(0);
		expect(meta.following).equals(false);
	});

	it("should mark the following as true if the user is following the author of the article", async () => {
		const { article, userA, userB, userService, articleService } =
			await setup();
		await userService.followUser({
			followerId: userA.id,
			followingId: userB.id
		});
		const meta = await articleService.getArticleMetaById({
			id: article.id,
			userId: userA.id
		});
		expect(meta.id).equals(article.id);
		expect(meta.favorited).equals(false);
		expect(meta.favoritesCount).equals(0);
		expect(meta.following).equals(true);
	});

	it("should increment the count of favorites if the user has favorited the article", async () => {
		const { article, userA, articleService } = await setup();
		await articleService.favorite({
			userId: userA.id,
			articleId: article.id
		});
		const meta = await articleService.getArticleMetaById({
			id: article.id,
			userId: userA.id
		});
		expect(meta.id).equals(article.id);
		expect(meta.favorited).equals(true);
		expect(meta.favoritesCount).equals(1);
		expect(meta.following).equals(false);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const userA = await userService.createUser(getCreateUserInput({}));
	const userB = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: userB.id })
	);
	return {
		userService,
		articleService,
		article,
		userA,
		userB
	};
};
