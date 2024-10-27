import { ErrorRequestHandler } from 'express';
import { v4 as Uuid } from 'uuid';

import { NodeEnv } from '@conduit/types';
import {
  ApiError,
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity,
  config,
  logger
} from '@conduit/utils';

import { ConfigureGlobalExceptionHandler } from './types';

export const configureGlobalExceptionHandler: ConfigureGlobalExceptionHandler = ({
  app,
  skipOnLocal = true
}) => {
  if (config.mode !== 'lambda' && skipOnLocal === true) {
    return;
  }
  logger.info('Configuring global exception handler for the application', {
    label: 'App'
  });
  app.use(handler);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: ErrorRequestHandler = (error, _req, res, _next): void => {
  if (process.env.NODE_ENV !== NodeEnv.Test) {
    // Log the error using the winston logger
    logger.error(error);
  }

  // Generate a unique error ID using UUID
  const errorId = Uuid();

  // If the error is a Joi validation error, format it as an Api error
  if (error.isJoi) {
    logger.error(JSON.stringify(error.details, null, 4));
    error = new ApiErrorUnprocessableEntity({
      message: error.details.map((item) => item.message).join('\n'),
      payload: error.details.map((item) => item.message)
    });
  }

  // If the error is not already an instance of ApiError, format it as an internal server error
  if (!(error && error instanceof ApiError)) {
    // eslint-disable-next-line no-console
    logger.error(error);
    error = new ApiErrorInternalServerError({
      message: error?.message,
      cause: error
    });
  }

  // Set the HTTP status code and return the error as a JSON response
  res.status(error.code).json({
    error: {
      id: errorId,
      code: error.code,
      message: error.message,
      errorCode: error.errorCode,
      errorType: error.errorType,
      payload: error.payload
    }
  });
};
