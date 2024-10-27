import { format } from 'winston';

export const environment = format((info) => {
  // eslint-disable-next-line no-param-reassign
  info.environment = process.env.NODE_ENV || 'development';
  return info;
});
