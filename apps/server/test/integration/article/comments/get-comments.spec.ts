import { expect } from "chai";
import supertest from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import {
	getCreateArticleInput,
	getCreateCommentInput,
	getCreateUserInput
} from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("Article - Get Comments", () => {
	it("should be able to get comments from an article", async () => {
		const { article } = await setup();
		const response = await request
			.get(
				ServerPath.GetCommentsFromAnArticle.replace(
					":slug",
					article.slug
				)
			)
			.send();
		expect(response.status).equals(200);
		expect(response.body.comments).is.not.null;
		expect(response.body.comments).instanceOf(Array);
		expect(response.body.comments).have.lengthOf(1);
	});

	it("should return a status code of 404 - Not Found if the article does not exist", async () => {
		const response = await request
			.get(
				ServerPath.GetCommentsFromAnArticle.replace(
					":slug",
					"NON_EXIST_SLUG"
				)
			)
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
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: author.id })
	);
	const comment = await articleService.createArticleComment(
		getCreateCommentInput({ articleId: article.id, userId: user.id })
	);
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		userService,
		articleService,
		user,
		author,
		article,
		comment,
		accessToken
	};
};
