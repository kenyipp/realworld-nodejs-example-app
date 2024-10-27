import stringify from 'fast-json-stable-stringify';
import { serializeError } from 'serialize-error';

import { AppErrorProps } from './types';

export class AppError extends Error {
  public readonly code?: string;
  public readonly details?: any[];
  public readonly cause?: Error;

  constructor(props: AppErrorProps) {
    super(props.message);
    this.code = props.code;
    this.details = props.details;
    this.cause = props.cause;
  }

  static assert(
    condition: boolean,
    code?: string,
    message?: string,
    details?: any[]
  ): asserts condition {
    if (!condition) {
      throw new AppError({
        message,
        code,
        details
      });
    }
  }

  public toJSON() {
    return stringify(serializeError(this));
  }
}
