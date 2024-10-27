import { RepoUser } from '@conduit/core/repository';

import { InvalidFollowError, UserNotFoundError } from '../../errors';
import {
  FollowHandlerConstructor,
  FollowUserInput,
  FollowUserOutput,
  UnfollowUserInput,
  UnfollowUserOutput
} from './types';

export class FollowHandler {
  private readonly repoUser: RepoUser;

  constructor({ repoUser }: FollowHandlerConstructor) {
    this.repoUser = repoUser;
  }

  async followUser({
    followerId,
    followingUsername
  }: FollowUserInput): FollowUserOutput {
    const profile = await this.repoUser.getUserProfile({
      username: followingUsername,
      requestingUserId: followerId
    });
    if (!profile) {
      throw new UserNotFoundError({ message: 'The requested user was not found.' });
    }
    if (followerId === profile.id) {
      throw new InvalidFollowError({ message: 'You cannot follow yourself' });
    }
    if (profile.following) {
      throw new InvalidFollowError({
        message: 'You are already following this user'
      });
    }
    await this.repoUser.followUser({ followerId, followingId: profile.id });
  }

  async unfollowUser({
    followerId,
    followingUsername
  }: UnfollowUserInput): UnfollowUserOutput {
    const profile = await this.repoUser.getUserProfile({
      username: followingUsername,
      requestingUserId: followerId
    });
    if (!profile) {
      throw new UserNotFoundError({ message: 'The requested user was not found.' });
    }
    if (followerId === profile.id) {
      throw new InvalidFollowError({ message: 'You cannot unfollow yourself' });
    }
    if (!profile.following) {
      throw new InvalidFollowError({ message: 'You are not following this user' });
    }
    await this.repoUser.unfollowUser({ followerId, followingId: profile.id });
  }
}
