import { AuthErrorCodes } from '../constants';
import { AuthError } from './AuthError';

export class PasswordRequirementsNotMetError extends AuthError {
  constructor({ details }: PasswordRequirementsNotMetErrorConstructor) {
    super({
      code: AuthErrorCodes.PasswordRequirementsNotMetError,
      message:
        'Password requirements not met. Your password must be at least 6 characters long and contain at least one letter and one digit.',
      details
    });
  }
}

interface PasswordRequirementsNotMetErrorConstructor {
  details?: string[];
}
