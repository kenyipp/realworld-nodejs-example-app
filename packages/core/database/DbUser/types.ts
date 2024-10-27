import { DbDtoProfile, DbDtoUser } from './dto';

/**
 *
 * function: createUser
 *
 */
export interface CreateUserInput {
  username: string;
  email: string;
  bio?: string;
  image?: string;
  hash: string;
}

export type CreateUserOutput = Promise<string>;

/**
 *
 * function: getIsUserExists
 *
 */
export interface GetIsUserExistsInput {
  userId?: string;
  email: string;
  username: string;
}

export type GetIsUserExistsOutput = Promise<{
  exists: boolean;
  emailExists: boolean;
  usernameExists: boolean;
}>;

/**
 *
 * function: getUsers
 *
 */
export interface GetUsersInput {
  ids?: string[];
  emails?: string[];
  usernames?: string[];
}

export type GetUsersOutput = Promise<DbDtoUser[]>;

/**
 *
 * function: updateUserById
 *
 */
export interface UpdateUserByIdInput {
  id: string;
  email?: string;
  username?: string;
  hash?: string;
  image?: string;
  bio?: string;
}

export type UpdateUserByIdOutput = Promise<void>;

/**
 *
 * function: followUser
 *
 */
export interface FollowUserInput {
  followerId: string;
  followingId: string;
}

export type FollowUserOutput = Promise<void>;

/**
 *
 * function: unfollowUser
 *
 */
export interface UnfollowUserInput {
  followerId: string;
  followingId: string;
}

export type UnfollowUserOutput = Promise<void>;

/**
 *
 * function: getUserProfiles
 *
 */
export interface GetUserProfilesInput {
  usernames: string[];
  requestingUserId?: string;
}

export type GetUserProfilesOutput = Promise<DbDtoProfile[]>;
