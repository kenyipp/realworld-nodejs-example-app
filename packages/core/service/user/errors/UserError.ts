import { AppError } from '../../../utils';
import { UserErrorCodes } from '../constants';

export class UserError extends AppError {
  constructor({
    code = UserErrorCodes.Generic,
    message,
    details,
    cause
  }: UserErrorConstructor) {
    super({
      code,
      message,
      details,
      cause
    });
  }
}

export interface UserErrorConstructor {
  message?: string;
  code?: UserErrorCodes;
  details?: any[];
  cause?: Error;
}
