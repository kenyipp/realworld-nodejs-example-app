import { RequestHandler } from 'express';

export const healthCheck: RequestHandler = async (_req, res) => {
  res.send('OK');
};
