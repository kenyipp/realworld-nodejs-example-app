import Joi from "joi";

export const userLoginSchema = Joi
	.object({
		user: Joi
			.object({
				username: Joi
					.string()
					.description("A string representing the user's username")
					.required(),
				password: Joi
					.string()
					.description("A string representing the user's password")
					.required()
			})
			.required()
	})
	.required();
