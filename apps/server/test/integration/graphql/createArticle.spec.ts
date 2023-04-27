import { expect } from "chai";
import supertest from "supertest";
import { jsonToGraphQLQuery } from "json-to-graphql-query";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../app";
import { signJsonWebToken } from "../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Create Article", () => {
	it("should be able to create an article", async () => {
		const { accessToken } = await setup();
		const query = {
			mutation: {
				createArticle: {
					__args: {
						title: "How to train your dragon",
						description: "Ever wonder how?",
						body: "You have to believe",
						tagList: ["react.js", "angular.js", "dragons"]
					},
					slug: true,
					title: true,
					description: true,
					body: true,
					favorited: true,
					favoritesCount: true,
					tagList: true
				}
			}
		};
		const graphqlString = jsonToGraphQLQuery(query, { pretty: true });
		const response = await request
			.post(ServerPath.GraphQL)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ query: graphqlString });
		expect(response.body.data).is.not.null;
		expect(response.body.data.article).is.not.null;
		expect(response.body.errors).is.undefined;
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const user = await userService.createUser(getCreateUserInput({}));
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		user,
		accessToken
	};
};
