import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorUnprocessableEntity extends ApiError {
  static Config = HttpError[422];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorUnprocessableEntityConstructor) {
    super({
      code: 422,
      message: message || ApiErrorUnprocessableEntity.Config.message,
      errorCode,
      errorType: ApiErrorUnprocessableEntity.Config.type,
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

interface ApiErrorUnprocessableEntityConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorUnprocessableEntityConstructor {
  condition: boolean;
}
