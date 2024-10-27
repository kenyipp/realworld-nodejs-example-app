import { RepoUser } from '@conduit/core/repository';
import { AuthService } from '@conduit/core/service';

export interface CreateUserHandlerConstructor {
  repoUser: RepoUser;
  authService: AuthService;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  image?: string;
  bio?: string;
}

export type CreateUserOutput = Promise<string>;

/**
 *
 * function: validateInput
 *
 */
export interface ValidateInputInput {
  email: string;
  username: string;
}

export type ValidateInputOutput = Promise<void>;
