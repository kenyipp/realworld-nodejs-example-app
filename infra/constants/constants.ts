import { config } from '../utils';

const app = 'conduit-api';
const { accountId } = config.aws;

export const ResourcePrefix = `${app}-${config.nodeEnv}-${accountId}`;
