import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { updateArticleBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiUpdateArticle = factory.newApiUpdateArticle();

export const updateArticle: RequestHandler<Params, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { user } = req;
  const { slug } = req.params;
  if (!user || !slug) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }

  const { value, error } = updateArticleBodySchema.validate(req.body);

  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  const { title, description, body } = value.article;

  const response = await apiUpdateArticle.execute({
    slug,
    userId: user.id,
    title,
    description,
    body
  });
  res.json(response);
};

interface Body {
  article: {
    title?: string;
    description?: string;
    body?: string;
  };
}

interface Params {
  slug: string;
}
