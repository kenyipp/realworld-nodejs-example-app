import { RequestHandler } from 'express';

import { ApiErrorUnprocessableEntity } from '@conduit/utils';

import { loginBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiUserLogin = factory.newApiUserLogin();

export const login: RequestHandler<unknown, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { value: input, error } = loginBodySchema.validate(req.body);

  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }

  const response = await apiUserLogin.execute(input.user);
  res.json(response);
};

interface Body {
  user: {
    email: string;
    password: string;
  };
}
