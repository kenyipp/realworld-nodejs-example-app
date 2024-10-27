import Joi from 'joi';

export const createArticleBodySchema = Joi.object({
  article: Joi.object({
    title: Joi.string()
      .description(
        'This field specifies the title of the article that you want to create.'
      )
      .required(),
    description: Joi.string()
      .description(
        'This field provides a brief summary or introduction to the article.'
      )
      .required(),
    body: Joi.string()
      .description(
        'This field contains the main content of the article, and should provides more detailed information on the topic.'
      )
      .required(),
    tagList: Joi.array()
      .items(Joi.string())
      .description(
        'One or more tags to help users find the article easily. Tags are specified as an array of strings.'
      )
      .empty(null)
      .default([])
  }).required()
}).required();
