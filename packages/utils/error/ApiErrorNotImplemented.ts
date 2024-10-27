import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorNotImplemented extends ApiError {
  static Config = HttpError[501];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorNotImplementedConstructor) {
    super({
      code: 501,
      message: message || ApiErrorNotImplemented.Config.message,
      errorCode,
      errorType: ApiErrorNotImplemented.Config.type,
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

interface ApiErrorNotImplementedConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorNotImplementedConstructor {
  condition: boolean;
}
