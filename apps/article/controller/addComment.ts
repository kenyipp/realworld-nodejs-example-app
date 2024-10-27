import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { addCommentBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiAddComments = factory.newApiAddComments();

export const addComment: RequestHandler<Params, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { user } = req;
  const { slug } = req.params;

  const { value: input, error } = addCommentBodySchema.validate(req.body);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  const comment = input.comment.body;

  if (!user || !slug) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }

  const response = await apiAddComments.execute({
    slug,
    userId: user.id,
    body: comment
  });
  res.json(response);
};

interface Body {
  comment: {
    body: string;
  };
}

interface Params {
  slug: string;
}
