"use strict";

const Joi = require("joi");

const article = Joi.object({
	title: Joi
		.string()
		.description("The title of the article")
		.required(),
	description: Joi
		.string()
		.description("A brief summary of the article")
		.required(),
	body: Joi
		.string()
		.description("The content of the article")
		.required()
});

const comment = Joi.object({
	body: Joi
		.string()
		.description("The content of the comment")
		.required()
});

const update = Joi.object({ article });

const create = Joi.object({
	article: article
		.keys({ tagList: Joi.array().items(Joi.string()) })
		.required()
});

const feed = Joi.object({
	offset: Joi
		.number()
		.description("Allows you to omit a specified number of pages before the beginning of the result set")
		.default(0),
	limit: Joi
		.number()
		.description("Allows you to limit the number of rows returned from a query")
		.default(20)
});

const list = feed.keys({
	tag: Joi.string(),
	author: Joi.string(),
	favorited: Joi.string()
});

const addComment = Joi.object({ comment });

module.exports = {
	update,
	create,
	feed,
	list,
	addComment
};
