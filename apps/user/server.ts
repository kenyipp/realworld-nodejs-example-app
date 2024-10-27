import { configureLambda } from '@conduit/middleware';

import { app } from './app';

export const handler = configureLambda({ app });
