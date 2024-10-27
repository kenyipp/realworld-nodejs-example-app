import { UserService } from '@conduit/core';
import { ApiErrorNotFound } from '@conduit/utils';

import {
  ApiGetProfileConstructor,
  ApiGetProfileInput,
  ApiGetProfileOutput
} from './types';

export class ApiGetProfile {
  private userService: UserService;

  constructor({ userService }: ApiGetProfileConstructor) {
    this.userService = userService;
  }

  async execute({ userId, username }: ApiGetProfileInput): ApiGetProfileOutput {
    const profile = await this.userService.getUserProfile({
      requestingUserId: userId,
      username
    });
    if (!profile) {
      throw new ApiErrorNotFound({
        cause: new Error(`Username ${username} not found`)
      });
    }
    return {
      profile
    };
  }
}
