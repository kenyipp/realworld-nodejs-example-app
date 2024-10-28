import { ResourcePrefix } from './constants';

export const Lambdas = {
  UserServerFunction: `${ResourcePrefix}-user-server-lambda`,
  AppServerFunction: `${ResourcePrefix}-app-server-lambda`,
  ArticleServerFunction: `${ResourcePrefix}-article-server-lambda`,
  TestingCron: `${ResourcePrefix}-testing-cron-lambda`
};
