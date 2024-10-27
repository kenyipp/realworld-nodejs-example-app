import { RequestHandler } from 'express';

import { ApiErrorUnauthorized } from '@conduit/utils';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiGetCurrentUser = factory.newApiGetCurrentUser();

export const getCurrentUser: RequestHandler = async (req, res) => {
  const { user } = req;
  if (user === undefined) {
    throw new ApiErrorUnauthorized({});
  }
  const response = await apiGetCurrentUser.execute({ user });
  res.json(response);
};
