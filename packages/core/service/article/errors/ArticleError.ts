import { AppError } from '../../../utils';
import { ArticleErrorCodes } from '../constants';

export class ArticleError extends AppError {
  constructor({
    code = ArticleErrorCodes.Generic,
    message,
    details,
    cause
  }: ArticleErrorConstructor) {
    super({
      code,
      message,
      details,
      cause
    });
  }
}

export interface ArticleErrorConstructor {
  message?: string;
  code?: ArticleErrorCodes;
  details?: any[];
  cause?: Error;
}
