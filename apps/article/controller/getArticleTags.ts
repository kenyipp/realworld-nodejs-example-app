import { RequestHandler } from 'express';

import { Factory } from '../service/Factory';

const factory = new Factory();
const apiGetTags = factory.newApiGetTags();

export const getArticleTags: RequestHandler = async (_req, res) => {
  const response = await apiGetTags.execute();
  res.json(response);
};
