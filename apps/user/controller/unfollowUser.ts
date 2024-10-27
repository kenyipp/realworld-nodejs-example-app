import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service';

const factory = new Factory();
const apiUnfollowUser = factory.newApiUnfollowUser();

export const unfollowUser: RequestHandler<
  Params,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { user } = req;
  const { username } = req.params;

  if (username === undefined || user === undefined) {
    throw new ApiErrorInternalServerError({});
  }

  const response = await apiUnfollowUser.execute({ username, userId: user.id });
  res.json(response);
};

interface Params {
  username: string;
}
