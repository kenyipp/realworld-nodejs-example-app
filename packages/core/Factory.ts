import { RepoFactory } from "./repository/RepoFactory";
import { ArticleService } from "./service/article/ArticleService";
import { AuthService } from "./service/auth/AuthService";
import { UserService } from "./service/user/UserService";

/**
 *
 * A factory for creating new instances of service classes.
 *
 */
export class Factory {
	private repoFactory: RepoFactory;

	constructor() {
		this.repoFactory = new RepoFactory();
	}

	static getInstance(): Factory {
		return new Factory();
	}

	newArticleService(): ArticleService {
		const repoArticle = this.repoFactory.newRepoArticle();
		const articleService = new ArticleService({ repoArticle });
		return articleService;
	}

	newAuthService(): AuthService {
		return new AuthService();
	}

	newUserService(): UserService {
		const repoUser = this.repoFactory.newRepoUser();
		const authService = this.newAuthService();
		return new UserService({ repoUser, authService });
	}
}
