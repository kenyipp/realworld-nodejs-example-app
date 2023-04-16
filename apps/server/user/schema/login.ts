import Joi from "joi";

export const loginSchema = Joi
	.object({
		user: Joi
			.object({
				email: Joi
					.string()
					.description("A string containing the user's unique email address associated with their account")
					.required(),
				password: Joi
					.string()
					.description("A string containing the user's secure and confidential password")
					.required()
			})
			.required()
	})
	.required();
