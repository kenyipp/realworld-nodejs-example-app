import Joi from 'joi';

export const getArticleFeedQuerySchema = Joi.object({
  limit: Joi.number().description('The numbers of items to return').default(20),
  offset: Joi.number()
    .description(
      'The number of items to skip before starting to collect the result set'
    )
    .default(0)
});
