import Joi from 'joi';

export const getArticlesQuerySchema = Joi.object({
  limit: Joi.number().description('The numbers of items to return').default(20),
  offset: Joi.number()
    .description(
      'The number of items to skip before starting to collect the result set'
    )
    .default(0),
  tag: Joi.string()
    .description('A string representing the tag by which to filter the articles')
    .empty(null),
  author: Joi.string()
    .description(
      'A string representing the username of the author by which to filter the articles'
    )
    .empty(null),
  favorited: Joi.string()
    .description(
      'A string representing the username of the user who favorited the articles to be included in the result set'
    )
    .empty(null)
})
  .optional()
  .default({});
