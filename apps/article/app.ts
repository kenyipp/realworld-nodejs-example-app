import express from 'express';

import {
  configureGlobalExceptionHandler,
  configureMiddlewares
} from '@conduit/middleware';

import { router } from './route';

export const app = express();

configureMiddlewares({ app });

app.use(router);

configureGlobalExceptionHandler({ app });
