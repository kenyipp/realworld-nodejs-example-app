import colors from '@colors/colors/safe';
import path from 'path';
import { format } from 'winston';

const { printf } = format;
const pwd = path.resolve(process.env.PWD || process.cwd());

const DefaultCustomPrintfOptions = {
  hideErrorStack: false
};

export const customPrintf = (
  options: CustomPrintfOptions = DefaultCustomPrintfOptions
) =>
  printf((info) => {
    let message = `${info.level} - ${info.message}`;

    if (info.stack && !options.hideErrorStack && process.env.NODE_ENV === 'dev') {
      const stackWithColors = info.stack
        .split('\n')
        .slice(1)
        .map((line: string, index: number) => {
          if (
            index === 0 ||
            (!line.includes('node_modules') && line.includes(pwd))
          ) {
            return line;
          }
          return colors.grey(line);
        })
        .join('\n');

      message += `\n${stackWithColors}`;
    }
    return message;
  });

type CustomPrintfOptions = {
  hideErrorStack: boolean;
};
