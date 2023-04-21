import { expect } from "chai";

import { Factory } from "../../Factory";
import { DbDtoArticleComment } from "../../database/dto";
import { dangerouslyResetDb } from "../../knex";
import {
	ArticleCommentNotFoundError,
	ArticleNotFoundError
} from "../../service/article/error";
import { getCreateArticleInput, getCreateUserInput } from "../mockData";

describe("Article - Comment", () => {
	describe("Add comment", () => {
		it("should be able to add comment to an article", async () => {
			const { articleService, article, user } = await setup();
			const comment = await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});
			expect(comment.id).is.not.null;
			expect(comment.body).equals(commentBody);
			expect(comment.userId).equals(user.id);
			expect(comment.createdAt).is.not.null;
			expect(comment.updatedAt).is.not.null;
		});

		it("should throw an error when trying to add a comment to a deleted article", async () => {
			const { articleService, article, user } = await setup();
			await articleService.deleteArticleBySlug({ slug: article.slug });
			try {
				await articleService.createArticleComment({
					articleId: article.id,
					body: commentBody,
					userId: user.id
				});
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(ArticleNotFoundError);
			}
		});
	});

	describe("Delete comment", () => {
		it("should be able to delete the comment", async () => {
			const { articleService, article, user } = await setup();
			const comment = await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});

			let count: number;

			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(1);

			await articleService.deleteArticleComment({ id: comment.id });

			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(0);
		});

		it("should throw an error if user tries to delete a comment that has already been deleted", async () => {
			const { articleService, article, user } = await setup();
			const comment = await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});
			await articleService.deleteArticleComment({ id: comment.id });
			try {
				await articleService.deleteArticleComment({ id: comment.id });
			} catch (error) {
				expect(error).instanceOf(ArticleCommentNotFoundError);
			}
		});
	});

	describe("Retrieve comments", () => {
		it("should be able to get comments from an article", async () => {
			const { articleService, article, user } = await setup();
			const comment = await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});

			const comments = await articleService.getArticleComments({
				articleId: article.id
			});
			expect(comments).have.lengthOf(1);
			expect(comments[0].id).equals(comment.id);
			expect(comments[0].userId).equals(comment.userId);
			expect(comments[0].userId).equals(user.id);

			const count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(1);
		});

		it("should not be possible to retrieve the deleted comments from an article", async () => {
			const { articleService, article, user } = await setup();
			const comment = await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});

			let comments: DbDtoArticleComment[];
			let count: number;

			comments = await articleService.getArticleComments({
				articleId: article.id
			});
			expect(comments).have.lengthOf(1);
			expect(comments[0].id).equals(comment.id);
			expect(comments[0].userId).equals(comment.userId);
			expect(comments[0].userId).equals(user.id);

			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(1);

			await articleService.deleteArticleComment({ id: comment.id });

			comments = await articleService.getArticleComments({
				articleId: article.id
			});
			expect(comments).have.lengthOf(0);

			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(0);
		});

		it("should hidden article's comments if the user who posted them has been banned", async () => {
			const { userService, articleService, user } = await setup();

			const userB = await userService.createUser(getCreateUserInput({}));
			const article = await articleService.createArticle(
				getCreateArticleInput({ userId: userB.id })
			);

			await articleService.createArticleComment({
				articleId: article.id,
				body: commentBody,
				userId: user.id
			});

			let comments: DbDtoArticleComment[];
			let count: number;

			comments = await articleService.getArticleComments({
				articleId: article.id
			});
			expect(comments).have.lengthOf(1);
			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(1);

			await userService.banUserById({ id: user.id });

			comments = await articleService.getArticleComments({
				articleId: article.id
			});
			expect(comments).have.lengthOf(0);
			count = await articleService.countArticleCommentsByArticleId({
				articleId: article.id
			});
			expect(count).equals(0);
		});
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const articleService = factory.newArticleService();
	const user = await userService.createUser(getCreateUserInput({}));
	const article = await articleService.createArticle(
		getCreateArticleInput({ userId: user.id })
	);
	return {
		userService,
		articleService,
		user,
		article
	};
};

const commentBody = "Hello world";
