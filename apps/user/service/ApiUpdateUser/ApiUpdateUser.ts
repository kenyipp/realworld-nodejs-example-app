import { PasswordRequirementsNotMetError, UserService } from '@conduit/core';
import {
  ApiErrorInternalServerError,
  ApiErrorUnprocessableEntity
} from '@conduit/utils';

import { ErrorCodes } from '../../constants';
import { DtoUser } from '../../dto';
import {
  ApiUpdateUserConstructor,
  ApiUpdateUserInput,
  ApiUpdateUserOutput
} from './types';

export class ApiUpdateUser {
  private readonly userService: UserService;

  constructor({ userService }: ApiUpdateUserConstructor) {
    this.userService = userService;
  }

  async execute({
    userId,
    username,
    email,
    bio,
    image,
    password
  }: ApiUpdateUserInput): ApiUpdateUserOutput {
    try {
      await this.userService.updateUserById({
        id: userId,
        username,
        email,
        bio,
        image,
        password
      });

      const user = await this.userService.getUserById({ id: userId });

      if (!user) {
        throw new Error('User not found in request object.');
      }

      const dtoUser = new DtoUser({
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image
      });

      return {
        user: dtoUser
      };
    } catch (error) {
      if (error instanceof PasswordRequirementsNotMetError) {
        throw new ApiErrorUnprocessableEntity({
          errorCode: ErrorCodes.PasswordRequirementsNotMet,
          message: 'Password does not meet the server requirements.'
        });
      }
      throw new ApiErrorInternalServerError({});
    }
  }
}
