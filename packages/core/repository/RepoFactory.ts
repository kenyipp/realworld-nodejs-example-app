import { DbFactory } from "../database/DbFactory";
import { RepoArticle } from "./RepoArticle";
import { RepoUser } from "./RepoUser";

/**
 *
 * A factory for creating new instances of repository classes.
 *
 */
export class RepoFactory {

	private dbFactory: DbFactory = new DbFactory();

	newRepoArticle(): RepoArticle {
		const dbArticle = this.dbFactory.newDbArticle();
		return new RepoArticle({ dbArticle });
	}

	newRepoUser(): RepoUser {
		const dbUser = this.dbFactory.newDbUser();
		return new RepoUser({ dbUser });
	}

}
