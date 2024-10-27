import { RepoFactory } from '@conduit/core/repository';

import { ArticleService } from './article';
import { AuthService } from './auth';
import { UserService } from './user';

export class ServiceFactory {
  private readonly repoFactory: RepoFactory = new RepoFactory();

  newAuthService(): AuthService {
    return new AuthService();
  }

  newArticleService(): ArticleService {
    const repoArticle = this.repoFactory.newRepoArticle();
    return new ArticleService({ repoArticle });
  }

  newUserService(): UserService {
    const repoUser = this.repoFactory.newRepoUser();
    const authService = this.newAuthService();
    return new UserService({ authService, repoUser });
  }
}
