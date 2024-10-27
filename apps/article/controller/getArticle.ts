import { Request, Response } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiGetArticle = factory.newApiGetArticle();

export const getArticle = async (
  req: Request<Params, unknown, unknown, unknown>,
  res: Response
) => {
  const { user } = req;
  const { slug } = req.params;
  if (!slug) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }
  const response = await apiGetArticle.execute({ slug, userId: user?.id });
  res.json(response);
};

interface Params {
  slug: string;
}
