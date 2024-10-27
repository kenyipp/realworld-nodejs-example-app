import winston, { format, transports } from 'winston';

import {
  capitalizeLevel,
  cleanStack,
  customPrintf,
  environment,
  label
} from './formats';

const { errors, json, combine, colorize, uncolorize, metadata } = format;
const { Console } = transports;
const { levels } = winston.config.npm;

const isDevelopment = process.env.NODE_ENV === 'dev';

export const logger = winston.createLogger({
  level: 'debug',
  levels,
  // Use the Console transport with a custom format
  transports: [
    new Console({
      format: combine(
        label({}),
        capitalizeLevel(),
        isDevelopment ? colorize() : uncolorize(),
        customPrintf()
      )
    })
  ],
  // Define the default log format options
  format: format.combine(
    environment(),
    cleanStack({}),
    errors({ stack: true }),
    json(),
    metadata({
      key: 'payload',
      fillExcept: ['label', 'timestamp', 'message', 'level', 'stack', 'environment']
    })
  ),
  // Don't exit the process when a handled exception occurs
  exitOnError: false,
  silent: process.env.NODE_ENV === 'test'
});
