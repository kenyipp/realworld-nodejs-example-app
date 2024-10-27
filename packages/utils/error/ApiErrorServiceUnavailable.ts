import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorServiceUnavailable extends ApiError {
  static Config = HttpError[503];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorServiceUnavailableConstructor) {
    super({
      code: 503,
      message: message || ApiErrorServiceUnavailable.Config.message,
      errorCode,
      errorType: ApiErrorServiceUnavailable.Config.type,
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

interface ApiErrorServiceUnavailableConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorServiceUnavailableConstructor {
  condition: boolean;
}
