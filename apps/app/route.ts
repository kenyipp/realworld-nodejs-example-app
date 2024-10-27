import Router from 'express-promise-router';

import { getApiDoc, getSwaggerJson, healthCheck } from './controller';

export const router = Router();

router.get('/api/health-check', healthCheck);

router.get('/swagger.json', getSwaggerJson);

router.get('/', getApiDoc);
