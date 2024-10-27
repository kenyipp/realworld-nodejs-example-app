import { RepoUser } from '@conduit/core/repository';
import { AuthService } from '@conduit/core/service/auth';

import { UserExistError } from '../../errors';
import {
  CreateUserHandlerConstructor,
  CreateUserInput,
  CreateUserOutput,
  ValidateInputInput,
  ValidateInputOutput
} from './types';

export class CreateUserHandler {
  private readonly authService: AuthService;
  private readonly repoUser: RepoUser;

  constructor({ authService, repoUser }: CreateUserHandlerConstructor) {
    this.authService = authService;
    this.repoUser = repoUser;
  }

  async createUser({
    email,
    username,
    password,
    image,
    bio
  }: CreateUserInput): CreateUserOutput {
    await this.validateInput({ email, username });
    // Encrypt password
    const encryptedPassword = await this.authService.encryptPassword({ password });
    // Create user in database and return userId
    const userId = await this.repoUser.createUser({
      email,
      username,
      bio,
      image,
      hash: encryptedPassword
    });
    return userId;
  }

  private async validateInput({
    email,
    username
  }: ValidateInputInput): ValidateInputOutput {
    const { exists, emailExists } = await this.repoUser.getIsUserExists({
      email,
      username
    });
    if (exists) {
      throw new UserExistError({
        type: emailExists ? 'email' : 'username'
      });
    }
  }
}
