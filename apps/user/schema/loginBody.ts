import Joi from 'joi';

export const loginBodySchema = Joi.object({
  user: Joi.object({
    email: Joi.string()
      .description("A string representing the user's username")
      .required(),
    password: Joi.string()
      .description("A string representing the user's password")
      .required()
  }).required()
}).required();
