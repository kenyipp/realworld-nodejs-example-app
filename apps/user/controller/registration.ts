import { RequestHandler } from 'express';

import { ApiErrorUnprocessableEntity } from '@conduit/utils';

import { registrationBodySchema } from '../schema';
import { Factory } from '../service/Factory';

const factory = new Factory();
const apiRegistration = factory.newApiRegistration();

export const registration: RequestHandler<unknown, unknown, Body, unknown> = async (
  req,
  res
) => {
  const { value: input, error } = registrationBodySchema.validate(req.body);
  if (error) {
    throw new ApiErrorUnprocessableEntity({
      message:
        'Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.',
      cause: error
    });
  }
  const response = await apiRegistration.execute(input.user);
  res.json(response);
};

interface Body {
  user: {
    username: string;
    email: string;
    password: string;
  };
}
