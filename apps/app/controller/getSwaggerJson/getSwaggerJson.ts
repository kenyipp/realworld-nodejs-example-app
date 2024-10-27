import { RequestHandler } from 'express';

import swagger from './swagger.json';

export const getSwaggerJson: RequestHandler = async (_req, res) => {
  res.json(swagger);
};
