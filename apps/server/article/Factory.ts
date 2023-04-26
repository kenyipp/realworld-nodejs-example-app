import { Factory } from "@conduit/core";
import { ArticleService, UserService } from "@conduit/core/service";

import {
	APIAddComments,
	APICreateArticle,
	APIDeleteArticle,
	APIDeleteComment,
	APIFavoriteArticle,
	APIFeedArticles,
	APIGetArticle,
	APIGetComments,
	APIGetTags,
	APIListArticles,
	APIUnfavoriteArticle,
	APIUpdateArticle
} from "./service";

export class ServiceFactory {
	private articleService: ArticleService;
	private userService: UserService;

	constructor() {
		const factory = new Factory();
		this.articleService = factory.newArticleService();
		this.userService = factory.newUserService();
	}

	newAPIAddComments() {
		return new APIAddComments({ articleService: this.articleService });
	}

	newAPICreateArticle() {
		return new APICreateArticle({ articleService: this.articleService });
	}

	newAPIDeleteArticle() {
		return new APIDeleteArticle({ articleService: this.articleService });
	}

	newAPIDeleteComment() {
		return new APIDeleteComment({ articleService: this.articleService });
	}

	newAPIFavoriteArticle() {
		return new APIFavoriteArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIFeedArticles() {
		return new APIFeedArticles({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetArticle() {
		return new APIGetArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetComments() {
		return new APIGetComments({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetTags() {
		return new APIGetTags({ articleService: this.articleService });
	}

	newAPIListArticles() {
		return new APIListArticles({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIUnfavoriteArticle() {
		return new APIUnfavoriteArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIUpdateArticle() {
		return new APIUpdateArticle({ articleService: this.articleService });
	}
}
