import { AppError } from '../../../utils';
import { AuthErrorCodes } from '../constants';

export class AuthError extends AppError {
  constructor({
    code = AuthErrorCodes.Generic,
    message,
    details,
    cause
  }: AuthErrorConstructor) {
    super({
      code,
      message,
      details,
      cause
    });
  }
}

export interface AuthErrorConstructor {
  message?: string;
  code?: AuthErrorCodes;
  details?: any[];
  cause?: Error;
}
