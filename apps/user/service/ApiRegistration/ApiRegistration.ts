import { v4 as uuid } from 'uuid';

import {
  AuthService,
  PasswordRequirementsNotMetError,
  UserExistError,
  UserService
} from '@conduit/core';
import {
  ApiErrorBadRequest,
  ApiErrorConflict,
  ApiErrorInternalServerError,
  logger
} from '@conduit/utils';

import { DtoUser } from '../../dto';
import {
  ApiRegistrationConstructor,
  ApiRegistrationInput,
  ApiRegistrationOutput
} from './types';

export class ApiRegistration {
  private readonly userService: UserService;
  private readonly authService: AuthService;

  constructor({ userService, authService }: ApiRegistrationConstructor) {
    this.userService = userService;
    this.authService = authService;
  }

  async execute({
    username,
    email,
    password,
    bio,
    image
  }: ApiRegistrationInput): ApiRegistrationOutput {
    const loginId = uuid();

    try {
      logger.info(`Creating user with email: ${email} and loginId: ${loginId}`, {
        label: 'ApiRegistration'
      });

      const userId = await this.userService.createUser({
        username,
        email,
        password,
        bio,
        image
      });
      const user = await this.userService.getUserById({ id: userId });

      if (!user) {
        throw new ApiErrorInternalServerError({});
      }

      const accessToken = this.authService.generateAccessToken({ userId, loginId });

      const dtoUser = new DtoUser({
        username: user.username,
        email: user.email,
        bio: user.bio,
        image: user.image,
        token: accessToken
      });

      return {
        user: dtoUser
      };
    } catch (error) {
      logger.error(
        `Error creating user with email: ${email} and loginId: ${loginId}. Error message: ${error instanceof Error ? error.message : error}`,
        { label: 'ApiRegistration' }
      );

      if (error instanceof PasswordRequirementsNotMetError) {
        throw new ApiErrorBadRequest({
          message:
            'Password requirements not met. Your password must be at least 6 characters long and contain at least one letter and one digit.',
          cause: error
        });
      }
      if (error instanceof UserExistError) {
        throw new ApiErrorConflict({
          message:
            'The provided email or username is already registered. Please use a different email or username.',
          cause: error
        });
      }
      throw error;
    }
  }
}
