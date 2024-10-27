import { RequestHandler } from 'express';

import { ApiErrorInternalServerError } from '@conduit/utils';

import { Factory } from '../service';

const factory = new Factory();
const apiGetUserProfile = factory.newApiGetProfile();

export const getUserProfile: RequestHandler<
  Params,
  unknown,
  unknown,
  unknown
> = async (req, res) => {
  const { user } = req;
  const { username } = req.params;

  if (username === undefined) {
    throw new ApiErrorInternalServerError({});
  }

  const response = await apiGetUserProfile.execute({ username, userId: user?.id });
  res.json(response);
};

interface Params {
  username: string;
}
