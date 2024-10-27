import slugify from 'slugify';

import { RepoArticle } from '@conduit/core/repository';

import { ArticleTitleAlreadyTakenError } from '../../errors';
import {
  CreateArticleHandlerConstructor,
  CreateArticleInput,
  CreateArticleOutput,
  ValidateIfArticleExistInput,
  ValidateIfArticleExistOutput
} from './types';

export class CreateArticleHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: CreateArticleHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async execute({
    title,
    description,
    body,
    userId
  }: CreateArticleInput): CreateArticleOutput {
    await this.validateIfArticleExist({ title });
    const slug = slugify(title);
    const articleId = await this.repoArticle.createArticle({
      title,
      slug,
      description,
      body,
      userId
    });
    return articleId;
  }

  private async validateIfArticleExist({
    title
  }: ValidateIfArticleExistInput): ValidateIfArticleExistOutput {
    const slug = slugify(title);
    const article = await this.repoArticle.getArticleBySlug({ slug });
    if (article) {
      throw new ArticleTitleAlreadyTakenError({ title });
    }
  }
}
