import { DbDtoProfile, UserService } from '@conduit/core';

export interface ApiFollowUserConstructor {
  userService: UserService;
}

export interface ApiFollowUserInput {
  username: string;
  userId: string;
}

export type ApiFollowUserOutput = Promise<{
  profile: DbDtoProfile;
}>;
