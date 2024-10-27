import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorRequestTimeout extends ApiError {
  static Config = HttpError[408];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorRequestTimeoutConstructor) {
    super({
      code: 408,
      message: message || ApiErrorRequestTimeout.Config.message,
      errorCode,
      errorType: ApiErrorRequestTimeout.Config.type,
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

interface ApiErrorRequestTimeoutConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorRequestTimeoutConstructor {
  condition: boolean;
}
