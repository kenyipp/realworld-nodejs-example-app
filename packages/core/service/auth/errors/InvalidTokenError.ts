import { AuthErrorCodes } from '../constants';
import { AuthError } from './AuthError';

export class InvalidTokenError extends AuthError {
  constructor({ message, cause }: InvalidTokenErrorConstructor) {
    super({
      code: AuthErrorCodes.InvalidToken,
      message:
        message ??
        'Sorry, your login is invalid. Please try again or contact support for help.',
      cause
    });
  }
}

interface InvalidTokenErrorConstructor {
  message?: string;
  cause?: Error;
}
