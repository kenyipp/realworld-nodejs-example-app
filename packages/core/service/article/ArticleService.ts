import { RepoArticle } from '@conduit/core/repository';

import {
  CreateArticleCommentHandler,
  CreateArticleCommentInput,
  CreateArticleCommentOutput,
  CreateArticleHandler,
  CreateArticleInput,
  CreateArticleOutput,
  CreateArticleTagsHandler,
  CreateTagsForArticleInput,
  CreateTagsForArticleOutput,
  FavoriteArticleHandler,
  FavoriteArticleInput,
  FavoriteArticleOutput,
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  GetArticleCommentsHandler,
  UnfavoriteArticleInput,
  UnfavoriteArticleOutput,
  UpdateArticleByIdInput,
  UpdateArticleByIdOutput,
  UpdateArticleHandler
} from './implementations';
import {
  ArticleServiceConstructor,
  CountArticlesInput,
  CountArticlesOutput,
  DeleteArticleByIdInput,
  DeleteArticleByIdOutput,
  DeleteArticleCommentByIdInput,
  DeleteArticleCommentByIdOutput,
  GetArticleByIdInput,
  GetArticleByIdOutput,
  GetArticleBySlugInput,
  GetArticleBySlugOutput,
  GetArticleCommentByIdInput,
  GetArticleCommentByIdOutput,
  GetArticlesInput,
  GetArticlesOutput,
  GetAvailableTagsOutput,
  GetTagsByArticleIdInput,
  GetTagsByArticleIdOutput,
  GetTagsByArticleIdsInput,
  GetTagsByArticleIdsOutput
} from './types';

export class ArticleService {
  private readonly repoArticle: RepoArticle;
  private readonly updateArticleHandler: UpdateArticleHandler;
  private readonly favoriteArticleHandler: FavoriteArticleHandler;
  private readonly createArticleHandler: CreateArticleHandler;
  private readonly createArticleTagsHandler: CreateArticleTagsHandler;
  private readonly createArticleCommentHandler: CreateArticleCommentHandler;
  private readonly getArticleCommentsHandler: GetArticleCommentsHandler;

  constructor({ repoArticle }: ArticleServiceConstructor) {
    this.repoArticle = repoArticle;
    this.createArticleHandler = new CreateArticleHandler({ repoArticle });
    this.createArticleTagsHandler = new CreateArticleTagsHandler({ repoArticle });
    this.createArticleCommentHandler = new CreateArticleCommentHandler({
      repoArticle
    });
    this.getArticleCommentsHandler = new GetArticleCommentsHandler({ repoArticle });
    this.favoriteArticleHandler = new FavoriteArticleHandler({ repoArticle });
    this.updateArticleHandler = new UpdateArticleHandler({ repoArticle });
  }

  async getArticles(input: GetArticlesInput): GetArticlesOutput {
    return this.repoArticle.getArticles(input);
  }

  async getArticleById({
    id,
    requestingUserId
  }: GetArticleByIdInput): GetArticleByIdOutput {
    const article = await this.repoArticle.getArticleById({ id, requestingUserId });
    return article;
  }

  async getArticleBySlug({
    slug,
    requestingUserId
  }: GetArticleBySlugInput): GetArticleBySlugOutput {
    const article = await this.repoArticle.getArticleBySlug({
      slug,
      requestingUserId
    });
    return article;
  }

  async countArticles(input: CountArticlesInput): CountArticlesOutput {
    return this.repoArticle.countArticles(input);
  }

  async createArticle(input: CreateArticleInput): CreateArticleOutput {
    return this.createArticleHandler.execute(input);
  }

  async createArticleComment(
    input: CreateArticleCommentInput
  ): CreateArticleCommentOutput {
    const commentId = await this.createArticleCommentHandler.execute(input);
    return commentId;
  }

  async createArticleTags(
    input: CreateTagsForArticleInput
  ): CreateTagsForArticleOutput {
    await this.createArticleTagsHandler.execute(input);
  }

  async updateArticleById(input: UpdateArticleByIdInput): UpdateArticleByIdOutput {
    await this.updateArticleHandler.execute(input);
  }

  async deleteArticleById({ id }: DeleteArticleByIdInput): DeleteArticleByIdOutput {
    await this.repoArticle.deleteArticleById({ id });
  }

  async getTagsByArticleId(
    input: GetTagsByArticleIdInput
  ): GetTagsByArticleIdOutput {
    return this.repoArticle.getTagsByArticleId(input);
  }

  async getTagsByArticleIds(
    input: GetTagsByArticleIdsInput
  ): GetTagsByArticleIdsOutput {
    return this.repoArticle.getTagsByArticleIds(input);
  }

  async getAvailableTags(): GetAvailableTagsOutput {
    return this.repoArticle.getAvailableTags();
  }

  async getArticleCommentsByArticleId(
    input: GetArticleCommentsByArticleIdInput
  ): GetArticleCommentsByArticleIdOutput {
    return this.getArticleCommentsHandler.execute(input);
  }

  async getArticleCommentById(
    input: GetArticleCommentByIdInput
  ): GetArticleCommentByIdOutput {
    return this.repoArticle.getArticleCommentById(input);
  }

  async favoriteArticle(input: FavoriteArticleInput): FavoriteArticleOutput {
    return this.favoriteArticleHandler.favorite(input);
  }

  async unfavoriteArticle(input: UnfavoriteArticleInput): UnfavoriteArticleOutput {
    return this.favoriteArticleHandler.unfavorite(input);
  }

  async deleteArticleCommentById(
    input: DeleteArticleCommentByIdInput
  ): DeleteArticleCommentByIdOutput {
    return this.repoArticle.deleteArticleCommentById(input);
  }
}
