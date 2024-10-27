import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorMethodNotAllowed extends ApiError {
  static Config = HttpError[405];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorMethodNotAllowedConstructor) {
    super({
      code: 405,
      message: message || ApiErrorMethodNotAllowed.Config.message,
      errorCode,
      errorType: ApiErrorMethodNotAllowed.Config.type,
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

interface ApiErrorMethodNotAllowedConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorMethodNotAllowedConstructor {
  condition: boolean;
}
