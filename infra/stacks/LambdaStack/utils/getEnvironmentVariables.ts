import { config } from '../../../utils';

export const getEnvironmentVariables = (vars: string[]) =>
  vars.reduce(
    (acc, curr) => {
      acc[curr] = process.env[curr];
      return acc;
    },
    {
      NODE_ENV: config.nodeEnv
    }
  );
