import { UserService } from '@conduit/core';

import { DtoProfile } from '../../dto';

export interface ApiGetProfileConstructor {
  userService: UserService;
}

export interface ApiGetProfileInput {
  username: string;
  userId?: string;
}

export type ApiGetProfileOutput = Promise<{
  profile: DtoProfile;
}>;
