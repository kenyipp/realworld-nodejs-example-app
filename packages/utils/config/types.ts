import { NodeEnv } from '@conduit/types';

export interface Config {
  nodeEnv: NodeEnv;
  mode: 'local' | 'lambda';
  domain: string;
  auth: {
    expiresIn: string;
    jwtSecret: string;
  };
  aws: {
    accountId: string;
    region: string;
    certificateArn?: string;
  };
  database: {
    conduit: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    };
  };
}
