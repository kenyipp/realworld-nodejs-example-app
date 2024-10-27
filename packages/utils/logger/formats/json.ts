import stringify from 'safe-stable-stringify';
import { MESSAGE } from 'triple-beam';
import { format } from 'winston';

export const json = format((info, options) => {
  const jsonStringify = stringify.configure(options);
  const stringified = jsonStringify(
    info,
    options.replacer || replacer,
    options.space
  );
  // eslint-disable-next-line no-param-reassign
  info[MESSAGE] = stringified;
  return info;
});

function replacer(_key: string, value: any) {
  /**
   *
   * While safe-stable-stringify does support BigInt,
   * it doesn't wrap the value in quotes, which can result in a loss of fidelity if the resulting string is parsed.
   * However, wrapping BigInts in quotes would be a breaking change for logform,
   * so it's currently not implemented.
   *
   */
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
}
