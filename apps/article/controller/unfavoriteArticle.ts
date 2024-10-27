import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiUnfavoriteArticle = factory.newApiUnfavoriteArticle();

export const unfavoriteArticle: RequestHandler<
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
  const response = await apiUnfavoriteArticle.execute({ slug, userId: user.id });
  res.json(response);
};

interface Params {
  slug: string;
}
