import { AuthService, DbDtoUser, UserService } from '@conduit/core';

import { DtoUser } from '../../dto';

export interface ApiUserLoginConstructor {
  authService: AuthService;
  userService: UserService;
}

export interface ApiUserLoginInput {
  email: string;
  password: string;
}

export type ApiUserLoginOutput = Promise<{
  user: DtoUser;
}>;

/**
 *
 * function: getUserByEmail
 *
 */
export interface GetUserByEmailInput {
  email: string;
}

export type GetUserByEmailOutput = Promise<DbDtoUser>;
