import { ArticleService, ServiceFactory } from '@conduit/core';

import { ApiAddComments } from './ApiAddComments';
import { ApiCreateArticle } from './ApiCreateArticle';
import { ApiDeleteArticle } from './ApiDeleteArticle';
import { ApiDeleteComment } from './ApiDeleteComment';
import { ApiFavoriteArticle } from './ApiFavoriteArticle';
import { ApiFeedArticles } from './ApiFeedArticles';
import { ApiGetArticle } from './ApiGetArticle';
import { ApiGetComments } from './ApiGetComments';
import { ApiGetTags } from './ApiGetTags';
import { ApiListArticles } from './ApiListArticles';
import { ApiUnfavoriteArticle } from './ApiUnfavoriteArticle';
import { ApiUpdateArticle } from './ApiUpdateArticle';

export class Factory {
  private articleService: ArticleService;

  constructor() {
    const factory = new ServiceFactory();
    this.articleService = factory.newArticleService();
  }

  newApiAddComments(): ApiAddComments {
    return new ApiAddComments({ articleService: this.articleService });
  }

  newApiCreateArticle(): ApiCreateArticle {
    return new ApiCreateArticle({ articleService: this.articleService });
  }

  newApiDeleteArticle(): ApiDeleteArticle {
    return new ApiDeleteArticle({ articleService: this.articleService });
  }

  newApiDeleteComment(): ApiDeleteComment {
    return new ApiDeleteComment({ articleService: this.articleService });
  }

  newApiFavoriteArticle(): ApiFavoriteArticle {
    return new ApiFavoriteArticle({
      articleService: this.articleService
    });
  }

  newApiFeedArticles(): ApiFeedArticles {
    return new ApiFeedArticles({
      articleService: this.articleService
    });
  }

  newApiGetArticle(): ApiGetArticle {
    return new ApiGetArticle({ articleService: this.articleService });
  }

  newApiGetComments(): ApiGetComments {
    return new ApiGetComments({ articleService: this.articleService });
  }

  newApiGetTags(): ApiGetTags {
    return new ApiGetTags({ articleService: this.articleService });
  }

  newApiListArticles(): ApiListArticles {
    return new ApiListArticles({ articleService: this.articleService });
  }

  newApiUnfavoriteArticle(): ApiUnfavoriteArticle {
    return new ApiUnfavoriteArticle({
      articleService: this.articleService
    });
  }

  newApiUpdateArticle(): ApiUpdateArticle {
    return new ApiUpdateArticle({ articleService: this.articleService });
  }
}
