import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorBadRequest extends ApiError {
  static Config = HttpError[400];

  constructor({
    message,
    errorCode,
    cause,
    payload
  }: ApiErrorBadRequestConstructor) {
    super({
      code: 400,
      message: message || ApiErrorBadRequest.Config.message,
      errorCode,
      errorType: ApiErrorBadRequest.Config.type,
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

interface ApiErrorBadRequestConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorBadRequestConstructor {
  condition: boolean;
}
