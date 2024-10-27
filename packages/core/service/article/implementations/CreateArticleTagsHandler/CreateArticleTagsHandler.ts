import { RepoArticle } from '@conduit/core/repository';

import { ArticleNotFoundError } from '../../errors';
import {
  CreateArticleTagsHandlerConstructor,
  CreateTagsForArticleInput,
  CreateTagsForArticleOutput,
  ValidateArticleIdInput,
  ValidateArticleIdOutput
} from './types';

export class CreateArticleTagsHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: CreateArticleTagsHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async execute({
    articleId,
    tagList
  }: CreateTagsForArticleInput): CreateTagsForArticleOutput {
    if (tagList.length < 1) {
      return;
    }
    await this.validateArticleId({ articleId });
    await this.repoArticle.createTagsForArticle({ articleId, tags: tagList });
  }

  private async validateArticleId({
    articleId
  }: ValidateArticleIdInput): ValidateArticleIdOutput {
    const article = await this.repoArticle.getArticleById({
      id: articleId
    });
    if (!article) {
      throw new ArticleNotFoundError({});
    }
  }
}
