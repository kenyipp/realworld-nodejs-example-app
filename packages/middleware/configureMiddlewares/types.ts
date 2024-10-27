import { Express } from 'express';

export interface ConfigureMiddlewares {
  (input: { app: Express; skipOnLocal?: boolean }): void;
}
