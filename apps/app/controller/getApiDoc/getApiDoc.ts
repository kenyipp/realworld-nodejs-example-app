import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

const redocHtml = fs.readFileSync(path.join(__dirname, './redoc.html'), 'utf8');

export const getApiDoc: RequestHandler = async (_req, res) => {
  res.send(redocHtml);
};
