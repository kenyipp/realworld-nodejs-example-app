import 'dotenv/config';

import { logger } from '@conduit/utils';

import { app } from './app';

app.listen(3100, () => {
  logger.info('User server is running on http://localhost:3100', { label: 'App' });
});
