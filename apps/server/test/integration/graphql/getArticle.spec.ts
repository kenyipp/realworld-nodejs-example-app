import { expect } from "chai";
import supertest from "supertest";
import { jsonToGraphQLQuery } from "json-to-graphql-query";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../app";
import { DtoArticle } from "../../../article/dto/DtoArticle";
import { signJsonWebToken } from "../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Get Article", () => {
	it("should be able to get an article", async () => {
		const { article } = await setup();
		const query = {
			article: {
				__args: {
					slug: article.slug
				},
				slug: true,
				title: true,
				description: true,
				body: true,
				createdAt: true,
				updatedAt: true,
				favorited: true,
				favoritesCount: true
			}
		};
		const response = await request
			.post(ServerPath.GraphQL)
			.send({ query: jsonToGraphQLQuery({ query }) });
		expect(response.body.data).is.not.null;
		expect(response.body.data.article).is.not.null;
		expect(response.body.errors).is.undefined;
		const dtoArticle: DtoArticle = response.body.data.article;
		expect(dtoArticle.slug).equals(article.slug);
	});

	it("should return an empty article object if the article has been deleted", async () => {
		const { articleService, article } = await setup();
		await articleService.deleteArticleBySlug({ slug: article.slug });
		const query = {
			article: {
				__args: {
					slug: article.slug
				},
				slug: true,
				title: true,
				description: true,
				body: true,
				createdAt: true,
				updatedAt: true,
				favorited: true,
				favoritesCount: true
			}
		};
		const response = await request
			.post(ServerPath.GraphQL)
			.send({ query: jsonToGraphQLQuery({ query }) });
		expect(response.body.data).is.not.null;
		expect(response.body.data.article).is.null;
		expect(response.body.errors).is.not.null;
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
