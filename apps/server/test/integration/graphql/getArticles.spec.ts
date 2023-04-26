import { expect } from "chai";
import supertest from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../app";
import { signJsonWebToken } from "../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Get Article", () => {
	it("should be able to retrieve a list of all articles", async () => {
		const { articles } = await setup();
		const totalArticleCount = Object.keys(articles).length;

		const response = await request.post(ServerPath.GraphQL).send({
			query: `{
				articles {
				  articles {
					slug
					title
					description
					body
					favorited
					favoritesCount
				  }
				  articlesCount
				}
			}`
		});

		expect(response.body.data).is.not.null;
		expect(response.body.data.articles.articles).instanceOf(Array);
		expect(response.body.errors).is.undefined;
		expect(response.body.data.articles.articles).have.lengthOf(
			totalArticleCount
		);
		expect(response.body.data.articles.articlesCount).equals(
			totalArticleCount
		);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const authorA = await userService.createUser(getCreateUserInput({}));
	const authorB = await userService.createUser(getCreateUserInput({}));
	const user = await userService.createUser(getCreateUserInput({}));
	const articleAWithTagFromAuthorA = await articleService.createArticle(
		getCreateArticleInput({ userId: authorA.id })
	);
	await articleService.createArticleTag({
		articleId: articleAWithTagFromAuthorA.id,
		tagList: ["TAG_A", "TAG_B"]
	});
	const articleBFromAuthorA = await articleService.createArticle(
		getCreateArticleInput({ userId: authorA.id })
	);
	const articleCFromAuthorB = await articleService.createArticle(
		getCreateArticleInput({ userId: authorB.id })
	);
	const articleDWithTagFromAuthorB = await articleService.createArticle(
		getCreateArticleInput({ userId: authorB.id })
	);
	await articleService.createArticleTag({
		articleId: articleDWithTagFromAuthorB.id,
		tagList: ["TAG_A"]
	});
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
