import 'dotenv/config';

import { logger } from '@conduit/utils';

import { app } from './app';

app.listen(3200, () => {
  logger.info('User server is running on http://localhost:3200', { label: 'App' });
});
