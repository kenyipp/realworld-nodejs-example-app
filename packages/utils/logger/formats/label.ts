import colors from '@colors/colors/safe';
import { get } from 'lodash';
import { format } from 'winston';

const isDevelopment = process.env.NODE_ENV === 'dev';

const labelMiddleware = format(
  (info, options: LabelOptions = DefaultLabelOptions) => {
    const {
      color = DefaultLabelOptions.color,
      labelColor = DefaultLabelOptions.labelColor
    } = options;

    const { label, message } = info;

    if (label) {
      // eslint-disable-next-line no-param-reassign
      info.message = `${
        color && isDevelopment && get(colors, labelColor)
          ? get(colors, labelColor)(`[${label}]`)
          : `[${label}]`
      } ${message}`;
    }

    return info;
  }
);

export interface LabelOptions {
  color: boolean;
  labelColor: string;
}

const DefaultLabelOptions = {
  color: false,
  labelColor: 'yellow'
};

export { labelMiddleware as label };
