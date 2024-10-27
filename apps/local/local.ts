import 'dotenv/config';

import express from 'express';

import { app as appApp } from '@conduit/app/app';
import { app as articleApp } from '@conduit/article/app';
import {
  configureGlobalExceptionHandler,
  configureMiddlewares
} from '@conduit/middleware';
import { app as userApp } from '@conduit/user/app';
import { logger } from '@conduit/utils';

export const app = express();

configureMiddlewares({ app, skipOnLocal: false });

app.use(appApp);
app.use(articleApp);
app.use(userApp);

configureGlobalExceptionHandler({ app, skipOnLocal: false });

const port = process.env.PORT || 3100;

app.listen(port, () => {
  logger.info(`Server is running on http://localhost:${port}`);
});
