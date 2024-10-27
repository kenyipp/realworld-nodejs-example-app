import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorTooManyRequests extends ApiError {
  static Config = HttpError[429];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorTooManyRequestsConstructor) {
    super({
      code: 429,
      message: message || ApiErrorTooManyRequests.Config.message,
      errorCode,
      errorType: ApiErrorTooManyRequests.Config.type,
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

interface ApiErrorTooManyRequestsConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorTooManyRequestsConstructor {
  condition: boolean;
}
