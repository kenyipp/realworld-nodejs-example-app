import { RepoUser } from '@conduit/core/repository';

import { AuthService } from '../auth';

export interface UserServiceConstructor {
  repoUser: RepoUser;
  authService: AuthService;
}
