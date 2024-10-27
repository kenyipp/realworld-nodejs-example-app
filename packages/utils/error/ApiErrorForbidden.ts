import { ApiError } from './ApiError';
import HttpError from './constants/http-error.json';

export class ApiErrorForbidden extends ApiError {
  static Config = HttpError[403];

  constructor({ message, errorCode, cause, payload }: ApiErrorForbiddenConstructor) {
    super({
      code: 403,
      message: message || ApiErrorForbidden.Config.message,
      errorCode,
      errorType: ApiErrorForbidden.Config.type,
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

interface ApiErrorForbiddenConstructor {
  message?: string;
  errorCode?: string;
  cause?: Error;
  payload?: any;
}

interface AssertInput extends ApiErrorForbiddenConstructor {
  condition: boolean;
}
