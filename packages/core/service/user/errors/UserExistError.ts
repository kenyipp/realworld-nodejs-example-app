import { UserErrorCodes } from '../constants';
import { UserError } from './UserError';

export class UserExistError extends UserError {
  public type: 'email' | 'username';

  constructor({ type }: UserExistErrorConstructor) {
    super({
      code: UserErrorCodes.UserExisted,
      message:
        type === 'email'
          ? 'The provided email is already registered. Please use a different email.'
          : 'The provided username is already taken. Please use a different username.'
    });
    this.type = type;
  }
}

interface UserExistErrorConstructor {
  type: 'email' | 'username';
}
