import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiDeleteComment = factory.newApiDeleteComment();

export const deleteComment: RequestHandler<
  Params,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { user } = req;
  const { id: commentId } = req.params;
  if (!user || !commentId) {
    throw new ApiErrorInternalServerError({
      cause: new Error('Missing required parameters. Check router settings.')
    });
  }
  const response = await apiDeleteComment.execute({ commentId, userId: user.id });
  res.json(response);
};

interface Params {
  id: string;
}
