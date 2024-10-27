import { ArticleErrorCodes } from '../constants';
import { ArticleError } from './ArticleError';

export class ArticleNotYetFavoritedError extends ArticleError {
  constructor({ userId, articleId }: ArticleNotYetFavoritedErrorConstructor) {
    super({
      code: ArticleErrorCodes.ArticleNotYetFavorited,
      message: 'Article is not yet favorited by the user',
      details: [userId, articleId]
    });
  }
}

interface ArticleNotYetFavoritedErrorConstructor {
  userId: string;
  articleId: string;
}
