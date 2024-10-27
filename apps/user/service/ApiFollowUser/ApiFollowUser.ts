import { InvalidFollowError, UserNotFoundError, UserService } from '@conduit/core';
import {
  ApiErrorBadRequest,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils';

import {
  ApiFollowUserConstructor,
  ApiFollowUserInput,
  ApiFollowUserOutput
} from './types';

export class ApiFollowUser {
  private userService: UserService;

  constructor({ userService }: ApiFollowUserConstructor) {
    this.userService = userService;
  }

  async execute({ userId, username }: ApiFollowUserInput): ApiFollowUserOutput {
    try {
      await this.userService.followUser({
        followerId: userId,
        followingUsername: username
      });

      const profile = await this.userService.getUserProfile({
        requestingUserId: userId,
        username
      });

      if (!profile) {
        throw new ApiErrorInternalServerError({
          cause: new Error(`Failed to get profile for username ${username}`)
        });
      }

      return {
        profile
      };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new ApiErrorNotFound({ cause: error });
      }
      if (error instanceof InvalidFollowError) {
        throw new ApiErrorBadRequest({ cause: error });
      }
      throw error;
    }
  }
}
