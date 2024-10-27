import nodeConfig from 'config';

import { Config } from './types';

export const config: Config = nodeConfig.util.toObject();
