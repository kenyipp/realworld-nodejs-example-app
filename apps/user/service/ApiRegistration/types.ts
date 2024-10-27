import { AuthService, UserService } from '@conduit/core';

import { DtoUser } from '../../dto';

export interface ApiRegistrationConstructor {
  userService: UserService;
  authService: AuthService;
}

export interface ApiRegistrationInput {
  username: string;
  email: string;
  password: string;
  bio?: string;
  image?: string;
}

export type ApiRegistrationOutput = Promise<{
  user: DtoUser;
}>;
