import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { createArticleBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiCreateArticle = factory.newApiCreateArticle();

export const createArticle: RequestHandler<unknown, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { user } = req;

  const { value: input, error } = createArticleBodySchema.validate(req.body);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  if (!user) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }

  const { title, description, body, tagList } = input.article;

  const response = await apiCreateArticle.execute({
    title,
    description,
    body,
    tagList,
    author: user
  });
  res.json(response);
};

interface Body {
  article: {
    title: string;
    description: string;
    body: string;
    tagList: string[];
  };
}
