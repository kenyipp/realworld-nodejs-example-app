import { startCase } from 'lodash';
import { format } from 'winston';

export const capitalizeLevel = format((info) => {
  if (info.level) {
    // eslint-disable-next-line no-param-reassign
    info.level = startCase(info.level);
  }
  return info;
});
