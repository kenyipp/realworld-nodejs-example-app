import { ArticleErrorCodes } from '../constants';
import { ArticleError } from './ArticleError';

export class ArticleTitleAlreadyTakenError extends ArticleError {
  constructor({ title }: ArticleTitleAlreadyTakenErrorConstructor) {
    super({
      code: ArticleErrorCodes.ArticleTitleTaken,
      message: `The title "${title}" is already taken. Please choose a different title.`,
      details: [title]
    });
  }
}

interface ArticleTitleAlreadyTakenErrorConstructor {
  title: string;
}
