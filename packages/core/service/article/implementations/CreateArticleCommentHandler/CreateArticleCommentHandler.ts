import { RepoArticle } from '@conduit/core/repository';

import { ArticleNotFoundError } from '../../errors';
import {
  CreateArticleCommentHandlerConstructor,
  CreateArticleCommentInput,
  CreateArticleCommentOutput,
  ValidateArticleInput,
  ValidateArticleOutput
} from './types';

export class CreateArticleCommentHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: CreateArticleCommentHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async execute({
    articleId,
    body,
    userId
  }: CreateArticleCommentInput): CreateArticleCommentOutput {
    await this.validateArticle({ articleId });
    const commentId = await this.repoArticle.createArticleComment({
      articleId,
      body,
      userId
    });
    return commentId;
  }

  private async validateArticle({
    articleId
  }: ValidateArticleInput): ValidateArticleOutput {
    const article = await this.repoArticle.getArticleById({
      id: articleId
    });
    if (!article) {
      throw new ArticleNotFoundError({});
    }
  }
}
