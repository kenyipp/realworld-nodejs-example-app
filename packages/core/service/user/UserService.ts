import { RepoUser } from '@conduit/core/repository';
import {
  GetUserByEmailInput,
  GetUserByEmailOutput,
  GetUserByIdInput,
  GetUserByIdOutput,
  GetUserProfileInput,
  GetUserProfileOutput
} from '@conduit/core/repository/RepoUser/types';

import {
  CreateUserHandler,
  CreateUserInput,
  CreateUserOutput,
  FollowHandler,
  FollowUserInput,
  FollowUserOutput,
  UnfollowUserInput,
  UnfollowUserOutput,
  UpdateUserHandler,
  UpdateUserInput,
  UpdateUserOutput
} from './implementations';
import { UserServiceConstructor } from './types';

export class UserService {
  private repoUser: RepoUser;
  private createUserHandler: CreateUserHandler;
  private updateUserHandler: UpdateUserHandler;
  private followHandler: FollowHandler;

  constructor({ repoUser, authService }: UserServiceConstructor) {
    this.repoUser = repoUser;
    this.createUserHandler = new CreateUserHandler({ repoUser, authService });
    this.updateUserHandler = new UpdateUserHandler({ repoUser, authService });
    this.followHandler = new FollowHandler({ repoUser });
  }

  async getUserProfile(input: GetUserProfileInput): GetUserProfileOutput {
    return this.repoUser.getUserProfile(input);
  }

  async getUserById({ id }: GetUserByIdInput): GetUserByIdOutput {
    return this.repoUser.getUserById({ id });
  }

  async getUserByEmail({ email }: GetUserByEmailInput): GetUserByEmailOutput {
    return this.repoUser.getUserByEmail({ email });
  }

  async updateUserById(input: UpdateUserInput): UpdateUserOutput {
    await this.updateUserHandler.execute(input);
  }

  async createUser(input: CreateUserInput): CreateUserOutput {
    return this.createUserHandler.createUser(input);
  }

  async followUser(input: FollowUserInput): FollowUserOutput {
    return this.followHandler.followUser(input);
  }

  async unfollowUser(input: UnfollowUserInput): UnfollowUserOutput {
    return this.followHandler.unfollowUser(input);
  }
}
