import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiDeleteArticle = factory.newApiDeleteArticle();

export const deleteArticle: RequestHandler<
  Params,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { user } = req;
  const { slug } = req.params;
  if (!user || !slug) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }
  const response = await apiDeleteArticle.execute({ slug, userId: user.id });
  res.json(response);
};

interface Params {
  slug: string;
}
