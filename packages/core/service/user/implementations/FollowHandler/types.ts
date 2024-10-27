import { RepoUser } from '@conduit/core/repository';

export interface FollowHandlerConstructor {
  repoUser: RepoUser;
}

/**
 *
 * function: followUser
 *
 */
export interface FollowUserInput {
  followerId: string;
  followingUsername: string;
}

export type FollowUserOutput = Promise<void>;

/**
 *
 * function: unfollowUser
 *
 */
export interface UnfollowUserInput {
  followerId: string;
  followingUsername: string;
}

export type UnfollowUserOutput = Promise<void>;
