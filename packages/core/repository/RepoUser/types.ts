import { DbDtoProfile, DbDtoUser, DbUser } from '@conduit/core/database';

export interface RepoUserConstructor {
  dbUser: DbUser;
}

export {
  CreateUserInput,
  CreateUserOutput,
  GetIsUserExistsInput,
  GetIsUserExistsOutput,
  UpdateUserByIdInput,
  UpdateUserByIdOutput,
  FollowUserInput,
  FollowUserOutput,
  UnfollowUserInput,
  UnfollowUserOutput
} from '@conduit/core/database/DbUser/types';

/**
 *
 * function: getUserById
 *
 */
export interface GetUserByIdInput {
  id: string;
}

export type GetUserByIdOutput = Promise<DbDtoUser | undefined>;

/**
 *
 * function: getUserByEmail
 *
 */
export interface GetUserByEmailInput {
  email: string;
}

export type GetUserByEmailOutput = Promise<DbDtoUser | undefined>;

/**
 *
 * function: getUserProfile
 *
 */
export interface GetUserProfileInput {
  username: string;
  requestingUserId?: string;
}

export type GetUserProfileOutput = Promise<DbDtoProfile | undefined>;
