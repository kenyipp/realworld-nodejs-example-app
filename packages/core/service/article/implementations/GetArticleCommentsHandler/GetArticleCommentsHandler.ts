import { RepoArticle } from '@conduit/core/repository';

import {
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  GetArticleCommentsHandlerConstructor
} from './types';

export class GetArticleCommentsHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: GetArticleCommentsHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async execute({
    articleId,
    limit,
    offset,
    requestingUserId
  }: GetArticleCommentsByArticleIdInput): GetArticleCommentsByArticleIdOutput {
    const comments = await this.repoArticle.getArticleCommentsByArticleId({
      articleId,
      limit,
      offset,
      requestingUserId
    });
    const count = await this.repoArticle.countArticleCommentsByArticleId({
      articleId
    });
    return {
      comments,
      count
    };
  }
}
