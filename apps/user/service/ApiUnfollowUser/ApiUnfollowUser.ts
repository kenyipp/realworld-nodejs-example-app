import { InvalidFollowError, UserNotFoundError, UserService } from '@conduit/core';
import {
  ApiErrorBadRequest,
  ApiErrorInternalServerError,
  ApiErrorNotFound
} from '@conduit/utils';

import {
  ApiUnfollowUserConstructor,
  ApiUnfollowUserInput,
  ApiUnfollowUserOutput
} from './types';

export class ApiUnfollowUser {
  private userService: UserService;

  constructor({ userService }: ApiUnfollowUserConstructor) {
    this.userService = userService;
  }

  async execute({ userId, username }: ApiUnfollowUserInput): ApiUnfollowUserOutput {
    try {
      await this.userService.unfollowUser({
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
