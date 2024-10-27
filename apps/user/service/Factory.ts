import { AuthService, ServiceFactory, UserService } from '@conduit/core';

import { ApiFollowUser } from './ApiFollowUser';
import { ApiGetCurrentUser } from './ApiGetCurrentUser';
import { ApiGetProfile } from './ApiGetProfile';
import { ApiRegistration } from './ApiRegistration';
import { ApiUnfollowUser } from './ApiUnfollowUser';
import { ApiUpdateUser } from './ApiUpdateUser';
import { ApiUserLogin } from './ApiUserLogin';

export class Factory {
  private authService: AuthService;
  private userService: UserService;

  constructor() {
    const factory = new ServiceFactory();
    this.authService = factory.newAuthService();
    this.userService = factory.newUserService();
  }

  newApiRegistration(): ApiRegistration {
    return new ApiRegistration({
      userService: this.userService,
      authService: this.authService
    });
  }

  newApiUserLogin(): ApiUserLogin {
    return new ApiUserLogin({
      userService: this.userService,
      authService: this.authService
    });
  }

  newApiUpdateUser(): ApiUpdateUser {
    return new ApiUpdateUser({
      userService: this.userService
    });
  }

  newApiGetCurrentUser(): ApiGetCurrentUser {
    return new ApiGetCurrentUser();
  }

  newApiFollowUser(): ApiFollowUser {
    return new ApiFollowUser({
      userService: this.userService
    });
  }

  newApiUnfollowUser(): ApiUnfollowUser {
    return new ApiUnfollowUser({
      userService: this.userService
    });
  }

  newApiGetProfile(): ApiGetProfile {
    return new ApiGetProfile({
      userService: this.userService
    });
  }
}
