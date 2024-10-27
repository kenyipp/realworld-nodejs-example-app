import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { getArticleFeedQuerySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiFeedArticles = factory.newApiFeedArticles();

export const getFeedArticles: RequestHandler<
  unknown,
  unknown,
  unknown,
  Query
> = async (req, res) => {
  const { value, error } = getArticleFeedQuerySchema.validate(req.query);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }
  const { user } = req;
  if (!user) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }

  const { limit, offset } = value;
  const response = await apiFeedArticles.execute({
    limit,
    offset,
    userId: user.id
  });
  res.json(response);
};

interface Query {
  limit: number;
  offset: number;
}
