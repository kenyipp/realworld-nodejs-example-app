import { UserErrorCodes } from '../constants';
import { UserError } from './UserError';

export class UserNotFoundError extends UserError {
  constructor({ message }: UserNotFoundErrorConstructor) {
    super({
      code: UserErrorCodes.UserNotFound,
      message:
        message ??
        'Sorry, we could not find an user with that information. Please try again with a different email or username'
    });
  }
}

export interface UserNotFoundErrorConstructor {
  message?: string;
}
