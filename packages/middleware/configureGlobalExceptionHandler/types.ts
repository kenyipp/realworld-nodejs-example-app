import { Express } from 'express';

export interface ConfigureGlobalExceptionHandler {
  (input: { app: Express; skipOnLocal?: boolean }): void;
}
