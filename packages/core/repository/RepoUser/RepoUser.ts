import { DbUser } from '@conduit/core/database';

import {
  CreateUserInput,
  CreateUserOutput,
  FollowUserInput,
  FollowUserOutput,
  GetIsUserExistsInput,
  GetIsUserExistsOutput,
  GetUserByEmailInput,
  GetUserByEmailOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
  GetUserProfileInput,
  GetUserProfileOutput,
  RepoUserConstructor,
  UnfollowUserInput,
  UnfollowUserOutput,
  UpdateUserByIdInput,
  UpdateUserByIdOutput
} from './types';

export class RepoUser {
  private readonly dbUser: DbUser;

  constructor({ dbUser }: RepoUserConstructor) {
    this.dbUser = dbUser;
  }

  async createUser(input: CreateUserInput): CreateUserOutput {
    return this.dbUser.createUser(input);
  }

  async getIsUserExists(input: GetIsUserExistsInput): GetIsUserExistsOutput {
    return this.dbUser.getIsUserExists(input);
  }

  async getUserById({ id }: GetUserByIdInput): GetUserByIdOutput {
    const [user] = await this.dbUser.getUsers({ ids: [id] });
    return user;
  }

  async getUserByEmail({ email }: GetUserByEmailInput): GetUserByEmailOutput {
    const [user] = await this.dbUser.getUsers({ emails: [email] });
    return user;
  }

  async updateUserById(input: UpdateUserByIdInput): UpdateUserByIdOutput {
    return this.dbUser.updateUser(input);
  }

  async getUserProfile({
    username,
    requestingUserId
  }: GetUserProfileInput): GetUserProfileOutput {
    const [profile] = await this.dbUser.getUserProfiles({
      usernames: [username],
      requestingUserId
    });
    return profile;
  }

  async followUser(input: FollowUserInput): FollowUserOutput {
    return this.dbUser.followUser(input);
  }

  async unfollowUser(input: UnfollowUserInput): UnfollowUserOutput {
    return this.dbUser.unfollowUser(input);
  }
}
