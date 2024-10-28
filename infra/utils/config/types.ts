export interface Config {
  nodeEnv: 'develop' | 'prod';
  aws: {
    region: string;
    accountId: string;
    arn: {
      role: {
        lambda: string;
      };
    };
  };
  github: {
    owner: string;
    repository: string;
  };
}
