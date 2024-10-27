import { RequestHandler } from 'express';

import { InvalidTokenError, ServiceFactory, UserStatus } from '@conduit/core';
import {
  ApiErrorForbidden,
  ApiErrorInternalServerError,
  ApiErrorUnauthorized
} from '@conduit/utils';

const serviceFactory = new ServiceFactory();
const authService = serviceFactory.newAuthService();
const userService = serviceFactory.newUserService();

export const auth: RequestHandler<unknown, unknown, unknown, unknown> = async (
  req,
  _res,
  next
) => {
  const { authorization } = req.headers;

  // Early return if no authorization header is present in the request headers
  if (authorization === undefined) {
    return next();
  }

  const [policy, accessToken] = authorization.split(' ');

  if (!policy || policy.toLowerCase() !== 'bearer' || !accessToken) {
    throw new ApiErrorUnauthorized({
      errorCode: 'auth_invalid_authentication_scheme',
      message:
        'The provided authentication scheme is not supported. Please use a bearer token.'
    });
  }

  try {
    const userId = authService.verifyAccessToken({ accessToken });

    const user = await userService.getUserById({ id: userId });

    if (!user) {
      throw new Error(
        'User is successfully authenticated but not found in the database'
      );
    }

    if (user.recordStatus === UserStatus.Banned) {
      throw new ApiErrorForbidden({
        errorCode: 'auth_user_banned',
        message:
          'Sorry, your account has been banned. Please contact the support team for further information.'
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    if (error instanceof Error === false) {
      return next(error);
    }
    if (error instanceof InvalidTokenError) {
      throw new ApiErrorUnauthorized({
        errorCode: 'auth_expired_token',
        message:
          'Sorry, your login is invalid. Please try again or contact support for help.',
        cause: error
      });
    }
    throw new ApiErrorInternalServerError({ cause: error });
  }
};

export const authRequired: RequestHandler<unknown, unknown, unknown, unknown> = (
  req,
  res,
  next
) => {
  const { authorization } = req.headers;

  if (authorization === undefined) {
    throw new ApiErrorUnauthorized({
      errorCode: 'auth_missing_header',
      message:
        'Authentication required. Please provide valid credentials to access this resource.'
    });
  }

  return auth(req, res, (error: any) => {
    if (error) {
      return next(error);
    }
    const { user } = req;
    if (!user) {
      throw new ApiErrorInternalServerError({
        cause: new Error('The user object should not be null')
      });
    }
    return next();
  });
};
