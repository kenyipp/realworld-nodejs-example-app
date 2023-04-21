import Joi from "joi";

import defaultConfig from "./default.json";

export const appConfigSchema = Joi.object({
	server: Joi.object({
		port: Joi.number().default(defaultConfig.server.port),
		appSignature: Joi.string().required(),
		tokenExpiresIn: Joi.number().default(
			defaultConfig.server.tokenExpiresIn
		)
	}).required(),
	auth: Joi.object({
		saltRounds: Joi.number().default(defaultConfig.auth.saltRounds)
	}).required(),
	database: Joi.object({
		host: Joi.string().default(defaultConfig.database.host).empty(null),
		user: Joi.string().default(defaultConfig.database.user).empty(null),
		password: Joi.string()
			.default(defaultConfig.database.password)
			.empty(null),
		port: Joi.number().default(defaultConfig.database.port),
		database: Joi.string().default(defaultConfig.database.database)
	}).required()
}).required();
