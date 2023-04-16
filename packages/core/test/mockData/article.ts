import { faker } from "@faker-js/faker";
import { CreateArticleInput, CreateArticleCommentInput } from "../../service/article/implementation";

/**
 *
 * Returns an input object containing information required to create an article.
 *
 * @function
 *
 * @param {object} input - The input containing the information required to create an article.
 * @param {string} [input.title] - The title of the article. If not provided, a random sentence is generated.
 * @param {string} [input.description] - The description of the article. If not provided, a random paragraph is generated.
 * @param {string} [input.body] - The body of the article. If not provided, two random paragraphs are generated.
 * @param {string} input.userId - The ID of the user creating the article.
 *
 * @returns {CreateArticleInput} - The input object containing the article information.
 *
 */
export const getCreateArticleInput = ({
	title,
	description,
	body,
	userId
}: GetCreateArticleInput): CreateArticleInput => {
	const input: CreateArticleInput = {
		title: title ?? faker.lorem.sentence(),
		description: description ?? faker.lorem.paragraph(),
		body: body ?? faker.lorem.paragraphs(2),
		userId
	};
	return input;
};

/**
 *
 * Get the input object for creating an article comment.
 *
 * @param {Object} options - The options for creating the comment.
 * @param {number} options.articleId - The ID of the article to create the comment for.
 * @param {string} [options.body] - The body of the comment. If not provided, a random paragraph is generated using Faker.
 * @param {number} options.userId - The ID of the user who created the comment.
 *
 * @returns {Object} The input object for creating an article comment.
 *
 */
export const getCreateCommentInput = ({
	articleId,
	body,
	userId
}: GetCreateCommentInput): CreateArticleCommentInput => {
	const input: CreateArticleCommentInput = {
		articleId,
		body: body ?? faker.lorem.paragraphs(),
		userId
	};
	return input;
};

interface GetCreateArticleInput {
	title?: string;
	description?: string;
	body?: string;
	userId: string;
}

interface GetCreateCommentInput {
	articleId: string;
	body?: string;
	userId: string;
}
