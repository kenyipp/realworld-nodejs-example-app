import { RepoUser } from '@conduit/core/repository';
import { AuthService } from '@conduit/core/service';

import { UserError, UserExistError, UserNotFoundError } from '../../errors';
import {
  UpdateUserHandlerConstructor,
  UpdateUserInput,
  UpdateUserOutput,
  ValidateUserExistInput,
  ValidateUserExistOutput
} from './types';

export class UpdateUserHandler {
  private authService: AuthService;
  private repoUser: RepoUser;

  constructor({ authService, repoUser }: UpdateUserHandlerConstructor) {
    this.authService = authService;
    this.repoUser = repoUser;
  }

  async execute({
    id,
    email,
    username,
    password,
    image,
    bio
  }: UpdateUserInput): UpdateUserOutput {
    const user = await this.repoUser.getUserById({ id });
    if (!user) {
      throw new UserNotFoundError({});
    }

    await this.validateUserExist({
      userId: id,
      email: email ?? user.email,
      username: username ?? user.username
    });

    const hash = password
      ? await this.authService.encryptPassword({ password })
      : undefined;

    await this.repoUser.updateUserById({
      id,
      email,
      username,
      hash,
      image,
      bio
    });
  }

  private async validateUserExist({
    userId,
    email,
    username
  }: ValidateUserExistInput): ValidateUserExistOutput {
    const { exists, emailExists, usernameExists } =
      await this.repoUser.getIsUserExists({
        userId,
        email,
        username
      });
    if (exists) {
      if (emailExists) {
        throw new UserExistError({ type: 'email' });
      }
      if (usernameExists) {
        throw new UserExistError({ type: 'username' });
      }
      throw new UserError({ message: 'User already exists' });
    }
  }
}
