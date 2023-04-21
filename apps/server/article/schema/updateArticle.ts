import Joi from "joi";

export const updateArticleSchema = Joi.object({
	article: Joi.object({
		title: Joi.string()
			.description(
				"This field specifies the title of the article that you want to create."
			)
			.empty(null),
		description: Joi.string()
			.description(
				"This field provides a brief summary or introduction to the article."
			)
			.empty(null),
		body: Joi.string()
			.description(
				"This field contains the main content of the article, and should provides more detailed information on the topic."
			)
			.empty(null)
	}).required()
}).required();
