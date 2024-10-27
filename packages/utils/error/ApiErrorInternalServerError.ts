import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorInternalServerError extends ApiError {
  static Config = HttpError[500];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorInternalServerErrorConstructor) {
    super({
      code: 500,
      message: message || ApiErrorInternalServerError.Config.message,
      errorCode,
      errorType: ApiErrorInternalServerError.Config.type,
      cause,
      payload
    });
  }

  static assert({
    condition,
    message,
    errorCode,
    cause,
    payload
  }: AssertInput): void {
    if (!condition) {
      throw new this({
        message,
        errorCode,
        cause,
        payload
      });
    }
  }
}

interface ApiErrorInternalServerErrorConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorInternalServerErrorConstructor {
  condition: boolean;
}
