import { UserErrorCodes } from '../constants';
import { UserError } from './UserError';

export class InvalidFollowError extends UserError {
  constructor({ message }: InvalidFollowErrorConstructor) {
    super({
      code: UserErrorCodes.InvalidFollow,
      message
    });
  }
}

interface InvalidFollowErrorConstructor {
  message: string;
}
