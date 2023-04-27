import { Factory as ServiceFactory } from "@conduit/core";
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
} from ".";

export class Factory {
	private articleService: ArticleService;
	private userService: UserService;

	constructor() {
		const factory = new ServiceFactory();
		this.articleService = factory.newArticleService();
		this.userService = factory.newUserService();
	}

	newAPIAddComments(): APIAddComments {
		return new APIAddComments({ articleService: this.articleService });
	}

	newAPICreateArticle(): APICreateArticle {
		return new APICreateArticle({ articleService: this.articleService });
	}

	newAPIDeleteArticle(): APIDeleteArticle {
		return new APIDeleteArticle({ articleService: this.articleService });
	}

	newAPIDeleteComment(): APIDeleteComment {
		return new APIDeleteComment({ articleService: this.articleService });
	}

	newAPIFavoriteArticle(): APIFavoriteArticle {
		return new APIFavoriteArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIFeedArticles(): APIFeedArticles {
		return new APIFeedArticles({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetArticle(): APIGetArticle {
		return new APIGetArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetComments(): APIGetComments {
		return new APIGetComments({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIGetTags(): APIGetTags {
		return new APIGetTags({ articleService: this.articleService });
	}

	newAPIListArticles(): APIListArticles {
		return new APIListArticles({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIUnfavoriteArticle(): APIUnfavoriteArticle {
		return new APIUnfavoriteArticle({
			articleService: this.articleService,
			userService: this.userService
		});
	}

	newAPIUpdateArticle(): APIUpdateArticle {
		return new APIUpdateArticle({ articleService: this.articleService });
	}
}
