import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { getCommentsQuerySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiGetComments = factory.newApiGetComments();

export const getComments: RequestHandler<Params, unknown, unknown, Query> = async (
  req,
  res
) => {
  const { user } = req;
  const { slug } = req.params;
  const { value, error } = getCommentsQuerySchema.validate(req.query);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }
  const { limit, offset } = value;

  if (!slug) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }

  const response = await apiGetComments.execute({
    slug,
    userId: user?.id,
    limit,
    offset
  });
  res.json(response);
};

interface Params {
  slug: string;
}

interface Query {
  limit: number;
  offset: number;
}
