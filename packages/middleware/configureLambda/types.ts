import configureServerlessExpress from '@vendia/serverless-express';
import { Express } from 'express';

export interface ConfigureLambda<TEvent = any, TResult = any> {
  (input: {
    app: Express;
  }): ReturnType<typeof configureServerlessExpress<TEvent, TResult>>;
}
