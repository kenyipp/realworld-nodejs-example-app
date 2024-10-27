import { v4 as uuid } from 'uuid';

import {
  AuthService,
  PasswordNotMatchError,
  UserService,
  UserStatus
} from '@conduit/core';
import {
  ApiErrorForbidden,
  ApiErrorInternalServerError,
  ApiErrorNotFound,
  ApiErrorUnauthorized
} from '@conduit/utils';

import { DtoUser } from '../../dto';
import {
  ApiUserLoginConstructor,
  ApiUserLoginInput,
  ApiUserLoginOutput,
  GetUserByEmailInput,
  GetUserByEmailOutput
} from './types';

export class ApiUserLogin {
  private authService: AuthService;
  private userService: UserService;

  constructor({ authService, userService }: ApiUserLoginConstructor) {
    this.authService = authService;
    this.userService = userService;
  }

  async execute({ email, password }: ApiUserLoginInput): ApiUserLoginOutput {
    const user = await this.getUserByEmail({ email });

    try {
      await this.authService.comparePassword({
        password,
        encryptedPassword: user!.hash
      });
    } catch (error) {
      if (error instanceof PasswordNotMatchError) {
        throw new ApiErrorUnauthorized({
          message:
            'Sorry, the password you entered is incorrect. Please double-check your password and try again.',
          cause: error
        });
      }
      throw new ApiErrorInternalServerError({
        cause: error instanceof Error ? error : undefined
      });
    }

    const loginId = uuid();

    const accessToken = this.authService.generateAccessToken({
      userId: user.id,
      loginId
    });

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
  }

  private async getUserByEmail({
    email
  }: GetUserByEmailInput): GetUserByEmailOutput {
    const user = await this.userService.getUserByEmail({ email });

    if (user === undefined) {
      throw new ApiErrorNotFound({
        message:
          "We couldn't find your account. Please check your login information or create a new account."
      });
    }

    if (user.recordStatus === UserStatus.Banned) {
      throw new ApiErrorForbidden({
        message:
          'Sorry, your account has been banned. Please contact support for more information.'
      });
    }

    return user;
  }
}
