import { RequestHandler } from 'express';

import { ApiErrorUnprocessableEntity } from '@conduit/utils';

import { getArticlesQuerySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiListArticles = factory.newApiListArticles();

export const getArticles: RequestHandler<unknown, unknown, unknown, Query> = async (
  req,
  res
) => {
  const { user } = req;
  const { value, error } = getArticlesQuerySchema.validate(req.query);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  const { tag, author, favorited, limit, offset } = value;

  const response = await apiListArticles.execute({
    tag,
    author,
    favorited,
    limit,
    offset,
    userId: user?.id
  });
  res.json(response);
};

export interface Query {
  tag?: string;
  author?: string;
  favorited?: string;
  limit: number;
  offset: number;
}
