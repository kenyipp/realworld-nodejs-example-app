import { ArticleErrorCodes } from '../constants';
import { ArticleError } from './ArticleError';

export class ArticleAlreadyFavoritedError extends ArticleError {
  constructor({ userId, articleId }: ArticleAlreadyFavoritedErrorConstructor) {
    super({
      code: ArticleErrorCodes.ArticleAlreadyFavorited,
      message: 'Article is already favorited by the user',
      details: [userId, articleId]
    });
  }
}

interface ArticleAlreadyFavoritedErrorConstructor {
  userId: string;
  articleId: string;
}
