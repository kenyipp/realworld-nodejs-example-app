import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorUnauthorized extends ApiError {
  static Config = HttpError[401];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorUnauthorizedConstructor) {
    super({
      code: 401,
      message: message || ApiErrorUnauthorized.Config.message,
      errorCode,
      errorType: ApiErrorUnauthorized.Config.type,
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

interface ApiErrorUnauthorizedConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorUnauthorizedConstructor {
  condition: boolean;
}
