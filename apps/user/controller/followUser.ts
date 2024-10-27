import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service';

const factory = new Factory();
const apiFollowUser = factory.newApiFollowUser();

export const followUser: RequestHandler<Params, unknown, unknown, unknown> = async (
  req,
  res
) => {
  const { user } = req;
  const { username } = req.params;

  if (username === undefined || user === undefined) {
    throw new ApiErrorInternalServerError({});
  }

  const response = await apiFollowUser.execute({ username, userId: user.id });
  res.json(response);
};

interface Params {
  username: string;
}
