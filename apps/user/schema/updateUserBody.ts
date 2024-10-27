import Joi from 'joi';

export const updateUserBodySchema = Joi.object({
  user: Joi.object({
    username: Joi.string()
      .description("A string representing the user's desired username")
      .empty(null),
    email: Joi.string()
      .email()
      .description("A string representing the user's email address")
      .empty(null),
    password: Joi.string()
      .description("A string representing the user's desired password")
      .empty(null),
    bio: Joi.string()
      .description("A string that represents the user's bio or description.")
      .empty(null),
    image: Joi.string()
      .description("A string that represents the user's profile image")
      .empty(null)
  }).required()
}).required();
