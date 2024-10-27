import { UserService } from '@conduit/core';

import { DtoUser } from '../../dto';

export interface ApiUpdateUserConstructor {
  userService: UserService;
}

export interface ApiUpdateUserInput {
  userId: string;
  username?: string;
  email?: string;
  bio?: string;
  image?: string;
  password?: string;
}

export type ApiUpdateUserOutput = Promise<{ user: DtoUser }>;
