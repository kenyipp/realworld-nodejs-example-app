import slugify from 'slugify';

import { RepoArticle } from '@conduit/core/repository';

import { ArticleNotFoundError, ArticleTitleAlreadyTakenError } from '../../errors';
import {
  UpdateArticleByIdInput,
  UpdateArticleByIdOutput,
  UpdateArticleHandlerConstructor,
  ValidateIfArticleExistInput,
  ValidateIfArticleExistOutput
} from './types';

export class UpdateArticleHandler {
  private repoArticle: RepoArticle;

  constructor({ repoArticle }: UpdateArticleHandlerConstructor) {
    this.repoArticle = repoArticle;
  }

  async execute({
    id,
    title,
    description,
    body
  }: UpdateArticleByIdInput): UpdateArticleByIdOutput {
    const article = await this.repoArticle.getArticleById({ id });
    if (!article) {
      throw new ArticleNotFoundError({});
    }

    let slug: string | undefined;
    if (title && article.title !== title) {
      await this.validateIfArticleExist({ title });
      slug = slugify(title);
    }

    await this.repoArticle.updateArticleById({
      id,
      title,
      slug,
      description,
      body
    });
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
