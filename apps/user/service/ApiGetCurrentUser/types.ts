import { DbDtoUser } from '@conduit/core';

import { DtoUser } from '../../dto';

export interface ApiGetCurrentUserInput {
  user: DbDtoUser;
}

export type ApiGetCurrentUserOutput = Promise<{ user: DtoUser }>;
