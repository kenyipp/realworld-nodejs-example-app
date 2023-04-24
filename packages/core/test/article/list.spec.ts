import FakeTimers from "@sinonjs/fake-timers";
import { expect } from "chai";
import moment from "moment";

import { Factory } from "../../Factory";
import { DbDtoArticle } from "../../database/dto";
import { dangerouslyResetDb } from "../../knex";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - List Articles", () => {
	it("should be able to return a list of articles", async () => {
		const { articleService, articleA, articleB } = await setup();
		const articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10
		});
		expect(articles).have.lengthOf(2);
		expect(articles[0]!.id).equals(articleB.id);
		expect(articles[1]!.id).equals(articleA.id);
	});

	it("should be able to return a filtered article list by tags", async () => {
		const { articleService, articleA } = await setup();
		const tag = "react.js";
		await articleService.createArticleTag({
			articleId: articleA.id,
			tagList: ["react.js"]
		});
		const articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10,
			tag
		});
		expect(articles).have.lengthOf(1);
		expect(articles[0]!.id).equals(articleA.id);
	});

	it("should be able to return a filtered article list by the author's name", async () => {
		const { articleService, userService } = await setup();
		const user = await userService.createUser(getCreateUserInput({}));
		const article = await articleService.createArticle(
			getCreateArticleInput({ userId: user.id })
		);
		let articles: DbDtoArticle[] = [];
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10
		});
		expect(articles).have.lengthOf(3);
		expect(articles[0]!.id).equals(article.id);
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10,
			author: user.username
		});
		expect(articles).have.lengthOf(1);
		expect(articles[0]!.id).equals(article.id);
	});

	it("should be able to return a filtered article list that is favorited by user", async () => {
		const { articleService, articleA, user } = await setup();
		let articles: DbDtoArticle[] = [];
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10,
			favorited: user.username
		});
		expect(articles).have.lengthOf(0);
		await articleService.favorite({
			userId: user.id,
			articleId: articleA.id
		});
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10,
			favorited: user.username
		});
		expect(articles).have.lengthOf(1);
	});

	it("should return an empty list if no articles match the filter parameters", async () => {
		const { articleService } = await setup();
		const articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10,
			tag: "react.js"
		});
		expect(articles).have.lengthOf(0);
	});

	it("should be able to limit the number of articles returned", async () => {
		const { articleService, articleB } = await setup();
		const articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 1
		});
		expect(articles).have.lengthOf(1);
		expect(articles[0]!.id).equals(articleB.id);
	});

	it("should be able to paginate the articles using the offset parameter", async () => {
		const { articleService, articleA } = await setup();
		const articles = await articleService.getArticlesByFilters({
			offset: 1,
			limit: 1
		});
		expect(articles).have.lengthOf(1);
		expect(articles[0]!.id).equals(articleA.id);
	});

	it("should hidden article's posts if the user who posted them has been banned", async () => {
		const { articleService, userService, user } = await setup();
		let articles: DbDtoArticle[] = [];
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10
		});
		expect(articles).have.lengthOf(2);
		await userService.banUserById({ id: user.id });
		articles = await articleService.getArticlesByFilters({
			offset: 0,
			limit: 10
		});
		expect(articles).have.lengthOf(0);
	});

	it("should be able to return a list of articles by followed users, ordered by most recent first", async () => {
		const { articleService, userService } = await setup();
		// Given that there are two users, user A and user B
		const userA = await userService.createUser(getCreateUserInput({}));
		const userB = await userService.createUser(getCreateUserInput({}));

		let articles: Array<DbDtoArticle> = [];
		let count = 0;

		articles = await articleService.getArticlesByFilters({
			followedBy: userA.id,
			offset: 0,
			limit: 10
		});
		count = await articleService.countArticles({ followedBy: userA.id });

		expect(articles).have.lengthOf(0);
		expect(count).equals(0);

		// User A is following User B
		await userService.followUser({
			followerId: userA.id,
			followingId: userB.id
		});
		// User B created an article
		await articleService.createArticle(
			getCreateArticleInput({ userId: userB.id })
		);

		articles = await articleService.getArticlesByFilters({
			followedBy: userA.id,
			offset: 0,
			limit: 10
		});
		count = await articleService.countArticles({ followedBy: userA.id });

		expect(articles).have.lengthOf(1);
		expect(count).equals(1);
	});

	it("should be able to remove articles from the feed when the user unfollows another user", async () => {
		const { articleService, userService } = await setup();
		// Given that there are two users, user A and user B
		const userA = await userService.createUser(getCreateUserInput({}));
		const userB = await userService.createUser(getCreateUserInput({}));

		let articles: Array<DbDtoArticle> = [];
		let count = 0;

		articles = await articleService.getArticlesByFilters({
			followedBy: userA.id,
			offset: 0,
			limit: 10
		});
		count = await articleService.countArticles({ followedBy: userA.id });

		expect(articles).have.lengthOf(0);
		expect(count).equals(0);

		// User A is following User B
		await userService.followUser({
			followerId: userA.id,
			followingId: userB.id
		});
		// User B created an article
		await articleService.createArticle(
			getCreateArticleInput({ userId: userB.id })
		);

		articles = await articleService.getArticlesByFilters({
			followedBy: userA.id,
			offset: 0,
			limit: 10
		});
		count = await articleService.countArticles({ followedBy: userA.id });

		expect(articles).have.lengthOf(1);
		expect(count).equals(1);

		await userService.unfollowUser({
			followerId: userA.id,
			followingId: userB.id
		});

		articles = await articleService.getArticlesByFilters({
			followedBy: userA.id,
			offset: 0,
			limit: 10
		});
		count = await articleService.countArticles({ followedBy: userA.id });

		expect(articles).have.lengthOf(0);
		expect(count).equals(0);
	});

	let clock: FakeTimers.InstalledClock | undefined;

	beforeEach(async () => {
		const now = Date.now();
		clock = FakeTimers.install();
		clock!.setSystemTime(now);
		await dangerouslyResetDb();
	});

	afterEach(() => {
		if (clock) {
			clock.uninstall();
		}
	});

	const setup = async () => {
		const factory = new Factory();
		const userService = factory.newUserService();
		const articleService = factory.newArticleService();
		const user = await userService.createUser(getCreateUserInput({}));
		const articleA = await articleService.createArticle(
			getCreateArticleInput({ userId: user.id })
		);
		clock?.setSystemTime?.(moment().add(1, "seconds").toDate());
		const articleB = await articleService.createArticle(
			getCreateArticleInput({ userId: user.id })
		);
		clock?.setSystemTime?.(moment().add(1, "seconds").toDate());
		return {
			articleService,
			userService,
			user,
			articleA,
			articleB
		};
	};
});
