import Joi from 'joi';

export const getCommentsQuerySchema = Joi.object({
  limit: Joi.number().description('The numbers of items to return').default(10),
  offset: Joi.number()
    .description(
      'The number of items to skip before starting to collect the result set'
    )
    .default(0)
});
