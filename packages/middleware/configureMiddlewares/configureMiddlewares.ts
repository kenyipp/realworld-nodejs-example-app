import bodyParser from 'body-parser';
import chalk from 'chalk';
import compression from 'compression';
import cors from 'cors';
import { Request, Response } from 'express';
import morgan from 'morgan';

import { NodeEnv } from '@conduit/types';
import { config, logger } from '@conduit/utils';

import { ConfigureMiddlewares } from './types';

export const configureMiddlewares: ConfigureMiddlewares = ({
  app,
  skipOnLocal = true
}) => {
  if (config.mode === 'local' && skipOnLocal === true) {
    return;
  }
  logger.info('Configuring middlewares for the application', { label: 'App' });

  // Enable gzip compression of HTTP responses
  app.use(compression());

  // Enable logging of incoming HTTP requests using the morgan package
  if (process.env.NODE_ENV !== NodeEnv.Test) {
    app.use(morgan(morganLogger));
  }

  // Parse JSON payloads in incoming HTTP requests
  app.use(bodyParser.json());

  app.use(cors());

  // Parse URL-encoded payloads in incoming HTTP requests
  app.use(bodyParser.urlencoded({ extended: true }));
};

const morganLogger: morgan.FormatFn<Request, Response> = (tokens, req, res) => {
  if (
    !tokens ||
    !tokens?.status ||
    !tokens['response-time'] ||
    !tokens.method ||
    !tokens.url
  ) {
    return '';
  }

  // Extract tokens and response time
  const status = tokens.status(req, res);
  const responseTimeInString = tokens['response-time'](req, res);
  const responseTime = parseInt(responseTimeInString ?? '', 10);

  // Construct log string with color coding
  return [
    chalk.yellow(tokens.method(req, res)),
    tokens.url(req, res),
    status &&
      status[0] &&
      chalk[parseInt(status[0], 10) <= 3 ? 'green' : 'red'](status),
    responseTime && chalk[responseTime > 500 ? 'red' : 'green'](`${responseTime}ms`)
  ]
    .filter(Boolean)
    .join(' - ');
};
