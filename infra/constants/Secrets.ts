import { config } from '../utils';

export const Secrets = {
  GithubToken: 'conduit/github-token',
  DatabaseConfig: `conduit/${config.nodeEnv}/database`,
  JwtSecret: `conduit/${config.nodeEnv}/jwt-token`,
  DomainCert: `conduit/${config.nodeEnv}/acm-certificate`
};
