import { RepoUser } from '@conduit/core/repository';
import { AuthService } from '@conduit/core/service';

export interface UpdateUserHandlerConstructor {
  authService: AuthService;
  repoUser: RepoUser;
}

export interface UpdateUserInput {
  id: string;
  email?: string;
  username?: string;
  password?: string;
  image?: string;
  bio?: string;
}

export type UpdateUserOutput = Promise<void>;

/**
 *
 * function: validateUserExistInput
 *
 */
export interface ValidateUserExistInput {
  userId: string;
  email: string;
  username: string;
}

export type ValidateUserExistOutput = Promise<void>;
