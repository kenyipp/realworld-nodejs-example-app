import { RequestHandler } from 'express';

import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { updateUserBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiUpdateUser = factory.newApiUpdateUser();

export const updateUser: RequestHandler<unknown, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { value: input, error } = updateUserBodySchema.validate(req.body);
  if (error || Object.keys(input.user).length === 0) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  const { user } = req;
  if (!user) {
    throw new ApiErrorInternalServerError({
      message: 'User not found in request object.'
    });
  }
  const userId = user.id;
  const { username, email, bio, image, password } = input.user;

  const response = await apiUpdateUser.execute({
    userId,
    username,
    email,
    bio,
    image,
    password
  });

  res.json(response);
};

interface Body {
  user: {
    username?: string;
    email?: string;
    bio?: string;
    image?: string;
    password?: string;
  };
}
