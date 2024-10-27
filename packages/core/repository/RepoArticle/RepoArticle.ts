import { DbArticle } from '@conduit/core/database';

import {
  CountArticleCommentsByArticleIdInput,
  CountArticleCommentsByArticleIdOutput,
  CountArticlesInput,
  CountArticlesOutput,
  CreateArticleCommentInput,
  CreateArticleCommentOutput,
  CreateArticleInput,
  CreateArticleOutput,
  CreateTagsForArticleInput,
  CreateTagsForArticleOutput,
  DeleteArticleByIdInput,
  DeleteArticleByIdOutput,
  DeleteArticleCommentByIdInput,
  DeleteArticleCommentByIdOutput,
  FavoriteArticleInput,
  FavoriteArticleOutput,
  GetArticleByIdInput,
  GetArticleByIdOutput,
  GetArticleBySlugInput,
  GetArticleBySlugOutput,
  GetArticleCommentByIdInput,
  GetArticleCommentByIdOutput,
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  GetArticleCommentsByIdsInput,
  GetArticleCommentsByIdsOutput,
  GetArticlesInput,
  GetArticlesOutput,
  GetAvailableTagsOutput,
  GetTagsByArticleIdInput,
  GetTagsByArticleIdOutput,
  GetTagsByArticleIdsInput,
  GetTagsByArticleIdsOutput,
  RepoArticleConstructor,
  UnfavoriteArticleInput,
  UnfavoriteArticleOutput,
  UpdateArticleByIdInput,
  UpdateArticleByIdOutput
} from './types';

export class RepoArticle {
  private dbArticle: DbArticle;

  constructor({ dbArticle }: RepoArticleConstructor) {
    this.dbArticle = dbArticle;
  }

  async createArticle(input: CreateArticleInput): CreateArticleOutput {
    return this.dbArticle.createArticle(input);
  }

  async createTagsForArticle({
    articleId,
    tags
  }: CreateTagsForArticleInput): CreateTagsForArticleOutput {
    if (tags.length < 1) {
      return;
    }
    await this.dbArticle.createTagsForArticle({ articleId, tags });
  }

  async createArticleComment(
    input: CreateArticleCommentInput
  ): CreateArticleCommentOutput {
    return this.dbArticle.createArticleComment(input);
  }

  async getArticles(input: GetArticlesInput): GetArticlesOutput {
    return this.dbArticle.getArticles(input);
  }

  async getArticleById({
    id,
    requestingUserId
  }: GetArticleByIdInput): GetArticleByIdOutput {
    const [article] = await this.dbArticle.getArticles({
      ids: [id],
      requestingUserId
    });
    return article;
  }

  async getArticleBySlug({ slug }: GetArticleBySlugInput): GetArticleBySlugOutput {
    const [article] = await this.dbArticle.getArticles({ slugs: [slug] });
    return article;
  }

  async deleteArticleById({ id }: DeleteArticleByIdInput): DeleteArticleByIdOutput {
    await this.dbArticle.deleteArticleById({ id });
  }

  async deleteArticleCommentById({
    id
  }: DeleteArticleCommentByIdInput): DeleteArticleCommentByIdOutput {
    await this.dbArticle.deleteArticleCommentById({ id });
  }

  async getTagsByArticleIds({
    articleIds
  }: GetTagsByArticleIdsInput): GetTagsByArticleIdsOutput {
    return this.dbArticle.getTagsByArticleIds({ articleIds });
  }

  async getAvailableTags(): GetAvailableTagsOutput {
    return this.dbArticle.getAvailableTags();
  }

  async getArticleCommentsByArticleId(
    input: GetArticleCommentsByArticleIdInput
  ): GetArticleCommentsByArticleIdOutput {
    return this.dbArticle.getArticleCommentsByArticleId(input);
  }

  async countArticleCommentsByArticleId(
    input: CountArticleCommentsByArticleIdInput
  ): CountArticleCommentsByArticleIdOutput {
    return this.dbArticle.countArticleCommentsByArticleId(input);
  }

  async getArticleCommentById({
    id,
    requestingUserId
  }: GetArticleCommentByIdInput): GetArticleCommentByIdOutput {
    const [comment] = await this.dbArticle.getArticleCommentsByIds({
      ids: [id],
      requestingUserId
    });
    return comment;
  }

  async updateArticleById(input: UpdateArticleByIdInput): UpdateArticleByIdOutput {
    await this.dbArticle.updateArticleById(input);
  }

  async getArticleCommentsByIds(
    input: GetArticleCommentsByIdsInput
  ): GetArticleCommentsByIdsOutput {
    return this.dbArticle.getArticleCommentsByIds(input);
  }

  async countArticles(input: CountArticlesInput): CountArticlesOutput {
    return this.dbArticle.countArticles(input);
  }

  async favoriteArticle(input: FavoriteArticleInput): FavoriteArticleOutput {
    return this.dbArticle.favoriteArticle(input);
  }

  async unfavoriteArticle(input: UnfavoriteArticleInput): UnfavoriteArticleOutput {
    return this.dbArticle.unfavoriteArticle(input);
  }

  async getTagsByArticleId({
    articleId
  }: GetTagsByArticleIdInput): GetTagsByArticleIdOutput {
    const response = await this.dbArticle.getTagsByArticleIds({
      articleIds: [articleId]
    });
    return response[articleId] ?? [];
  }
}
