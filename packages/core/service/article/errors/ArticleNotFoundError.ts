import { ArticleErrorCodes } from '../constants';
import { ArticleError } from './ArticleError';

export class ArticleNotFoundError extends ArticleError {
  constructor({ slug }: ArticleNotFoundErrorConstructor) {
    super({
      code: ArticleErrorCodes.ArticleNotFound,
      message: 'The requested article was not found.',
      details: slug ? [slug] : []
    });
  }
}

interface ArticleNotFoundErrorConstructor {
  slug?: string;
}
