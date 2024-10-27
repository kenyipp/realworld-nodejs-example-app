import configureServerlessExpress from '@vendia/serverless-express';

import { ConfigureLambda } from './types';

export const configureLambda: ConfigureLambda = ({ app }) =>
  configureServerlessExpress({
    app,
    logSettings: {
      level: process.env.LOG_LEVEL || 'info'
    }
  });
