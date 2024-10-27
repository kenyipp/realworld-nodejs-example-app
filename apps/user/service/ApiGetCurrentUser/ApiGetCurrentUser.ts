import { UserStatus } from '@conduit/core';
import { ApiErrorForbidden } from '@conduit/utils';

import { DtoUser } from '../../dto';
import { ApiGetCurrentUserInput, ApiGetCurrentUserOutput } from './types';

export class ApiGetCurrentUser {
  async execute({ user }: ApiGetCurrentUserInput): ApiGetCurrentUserOutput {
    if (user.recordStatus === UserStatus.Banned) {
      throw new ApiErrorForbidden({
        message:
          'Sorry, your account has been banned. You can no longer access our services. If you think this is a mistake, please contact our support team. Thank you.'
      });
    }
    const dtoUser = new DtoUser({
      username: user.username,
      email: user.email,
      bio: user.bio,
      image: user.image
    });
    return {
      user: dtoUser
    };
  }
}
