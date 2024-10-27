import { DbArticle } from './DbArticle';
import { DbUser } from './DbUser';

/**
 *
 * A factory for creating new instances of database entities.
 *
 */
export class DbFactory {
  newDbUser(): DbUser {
    const dbUser = new DbUser();
    return dbUser;
  }

  newDbArticle(): DbArticle {
    const dbArticle = new DbArticle();
    return dbArticle;
  }
}
