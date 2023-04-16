import { DbArticle } from "./DbArticle";
import { DbUser } from "./DbUser";

/**
 *
 * A factory for creating new instances of database entities.
 *
 */
export class DbFactory {

	newDbArticle(): DbArticle {
		const dbArticle = new DbArticle();
		return dbArticle;
	}

	newDbUser(): DbUser {
		const dbUser = new DbUser();
		return dbUser;
	}

}
