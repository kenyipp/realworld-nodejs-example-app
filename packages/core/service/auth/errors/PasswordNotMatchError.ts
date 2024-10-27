import { AuthErrorCodes } from '../constants';
import { AuthError } from './AuthError';

export class PasswordNotMatchError extends AuthError {
  constructor() {
    super({
      code: AuthErrorCodes.PasswordNotMatch,
      message: 'Passwords do not match. Please try again.'
    });
  }
}
