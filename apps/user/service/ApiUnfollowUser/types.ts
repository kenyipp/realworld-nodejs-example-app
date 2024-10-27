import { DbDtoProfile, UserService } from '@conduit/core';

export interface ApiUnfollowUserConstructor {
  userService: UserService;
}

export interface ApiUnfollowUserInput {
  username: string;
  userId: string;
}

export type ApiUnfollowUserOutput = Promise<{
  profile: DbDtoProfile;
}>;
