import Joi from "joi";

export const registrationSchema = Joi
	.object({
		user: Joi.object({
			username: Joi
				.string()
				.description("A string representing the user's desired username")
				.required(),
			email: Joi
				.string()
				.description("A string representing the user's email address")
				.required(),
			password: Joi
				.string()
				.description("A string representing the user's desired password")
				.required()
		})
			.required()
	})
	.required();
