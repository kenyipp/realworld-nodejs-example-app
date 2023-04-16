import supertest from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Create Article", () => {
	it("should be able to create an article", async () => {
		const { accessToken } = await setup();
		const response = await request
			.post(ServerPath.CreateArticle)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				article: {
					title: "How to train your dragon",
					description: "Ever wonder how?",
					body: "You have to believe",
					tagList: ["react.js", "angular.js", "dragons"]
				}
			});
		expect(response.status).equals(200);
		expect(response.body.article).is.not.null;
		const { article } = response.body;
		expect(article.tagList).have.lengthOf(3);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		const response = await request
			.post(ServerPath.CreateArticle)
			.send({
				article: {
					title: "How to train your dragon",
					description: "Ever wonder how?",
					body: "You have to believe",
					tagList: ["react.js", "angular.js", "dragons"]
				}
			});
		expect(response.status).equals(401);
	});

	it("should return a status code of 403 - Forbidden if the user has been banned", async () => {
		const {
			user,
			userService,
			accessToken
		} = await setup();
		await userService.banUserById({ id: user.id });
		const response = await request
			.post(ServerPath.CreateArticle)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(403);
	});

	it("should return a status code of 422 - Unprocessable Entity if the client provides invalid data", async () => {
		const { accessToken } = await setup();
		const response = await request
			.post(ServerPath.CreateArticle)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ article: { title: "How to train your dragon" } });
		expect(response.status).equals(422);
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
