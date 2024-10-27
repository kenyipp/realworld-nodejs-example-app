import { groupBy, indexOf, sortBy } from 'lodash';

import { RecordStatus, UserStatus } from '@conduit/core/types';
import { getObjectId } from '@conduit/core/utils';

import { knex } from '../knex';
import {
  DbDtoArticle,
  DbDtoArticleComment,
  DbDtoArticleCommentWithProfile,
  DbDtoArticleTag
} from './dto';
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
  GetArticleCommentsByArticleIdInput,
  GetArticleCommentsByArticleIdOutput,
  GetArticleCommentsByIdsInput,
  GetArticleCommentsByIdsOutput,
  GetArticleQueryByFiltersInput,
  GetArticleQueryByFiltersOutput,
  GetArticlesInput,
  GetArticlesOutput,
  GetAvailableTagsOutput,
  GetTagsByArticleIdsInput,
  GetTagsByArticleIdsOutput,
  UnfavoriteArticleInput,
  UnfavoriteArticleOutput,
  UpdateArticleByIdInput,
  UpdateArticleByIdOutput
} from './types';

export class DbArticle {
  async createArticle({
    title,
    slug,
    description,
    body,
    userId
  }: CreateArticleInput): CreateArticleOutput {
    const articleId = getObjectId();
    await knex
      .insert({
        article_id: articleId,
        slug,
        title,
        description,
        body,
        user_id: userId,
        created_at: new Date(),
        updated_at: new Date()
      })
      .into('article');
    return articleId;
  }

  async createTagsForArticle({
    articleId,
    tags
  }: CreateTagsForArticleInput): CreateTagsForArticleOutput {
    await knex
      .insert(
        tags.map((tag) => ({
          article_tag_id: getObjectId(),
          tag,
          article_id: articleId,
          record_status: RecordStatus.Active
        }))
      )
      .into('article_tag')
      .onConflict(['tag', 'article_id'])
      .merge(['record_status']);
  }

  async createArticleComment({
    articleId,
    body,
    userId
  }: CreateArticleCommentInput): CreateArticleCommentOutput {
    const commentId = getObjectId();
    await knex.table('article_comment').insert({
      article_comment_id: commentId,
      article_id: articleId,
      body,
      user_id: userId
    });
    return commentId;
  }

  async updateArticleById({
    id,
    title,
    slug,
    description,
    body
  }: UpdateArticleByIdInput): UpdateArticleByIdOutput {
    if (!title && !description && !body) {
      return;
    }
    // Create an empty object to store the updates
    const updates = {
      title,
      slug,
      description,
      body
    };
    // Update the article in the database with the new values
    await knex.table('article').update(updates).where('article_id', id);
  }

  async getArticles({
    ids,
    slugs,
    tags,
    author,
    favorited,
    followedBy,
    limit,
    offset,
    requestingUserId
  }: GetArticlesInput): GetArticlesOutput {
    let query = this.getArticleQueryByFilters({
      ids,
      slugs,
      tags,
      author,
      favorited,
      followedBy
    });
    if (limit !== undefined) {
      query = query.limit(limit);
    }
    if (offset !== undefined) {
      query = query.offset(offset * (limit ?? 1));
    }
    const articles = await query
      .select({
        id: 'article.article_id',
        title: 'article.title',
        slug: 'article.slug',
        description: 'article.description',
        body: 'article.body',
        userId: 'article.user_id',
        recordStatus: 'article.record_status',
        createdAt: 'article.created_at',
        updatedAt: 'article.updated_at',
        favoritesCount: knex
          .count('article_favorite_id')
          .from('article_favorite')
          .where('article_id', knex.raw('article.article_id'))
          .where('record_status', RecordStatus.Active),
        favorited: knex
          .count('article_favorite_id')
          .from('article_favorite')
          .where(function () {
            this.where('article_id', knex.raw('article.article_id'));
            this.where('record_status', RecordStatus.Active);
            if (requestingUserId) {
              this.where('user_id', knex.raw('?', [requestingUserId]));
            }
          }),
        authorId: 'article.user_id',
        authorUsername: 'user.username',
        authorBio: 'user.bio',
        authorImage: 'user.image',
        isFollowing: knex.raw(
          '(CASE WHEN user_follow_id IS NULL THEN FALSE ELSE TRUE END)'
        )
      })
      .leftJoin('user', 'article.user_id', 'user.user_id')
      .leftJoin('user_follow', function () {
        this.on('user_follow.following_id', '=', 'user.user_id');
        this.on(
          'user_follow.record_status',
          '=',
          knex.raw('?', [RecordStatus.Active])
        );
        if (requestingUserId) {
          this.andOn(
            'user_follow.follower_id',
            '=',
            knex.raw('?', [requestingUserId])
          );
        }
      })
      .then((rows) =>
        rows.map((row) => {
          const {
            id,
            title,
            slug,
            description,
            body,
            userId,
            recordStatus,
            createdAt,
            updatedAt,
            favoritesCount,
            favorited: isFavorited,
            authorId,
            authorUsername,
            authorBio,
            authorImage,
            isFollowing
          } = row;
          return new DbDtoArticle({
            id,
            title,
            slug,
            description,
            body,
            userId,
            recordStatus,
            createdAt,
            updatedAt,
            favoritesCount,
            favorited: isFavorited > 0,
            author: {
              id: authorId,
              username: authorUsername,
              bio: authorBio,
              image: authorImage,
              following: isFollowing
            }
          });
        })
      );
    return articles;
  }

  async getArticleCommentsByArticleId({
    articleId,
    limit,
    offset,
    requestingUserId
  }: GetArticleCommentsByArticleIdInput): GetArticleCommentsByArticleIdOutput {
    const query = knex
      .select({
        id: 'article_comment.article_comment_id',
        body: 'article_comment.body',
        createdAt: 'article_comment.created_at',
        updatedAt: 'article_comment.updated_at',
        authorId: 'article_comment.user_id',
        authorUsername: 'user.username',
        authorBio: 'user.bio',
        authorImage: 'user.image',
        isFollowing: knex.raw(
          '(CASE WHEN user_follow_id IS NULL THEN FALSE ELSE TRUE END)'
        )
      })
      .from('article_comment')
      .leftJoin('user', 'article_comment.user_id', 'user.user_id')
      // eslint-disable-next-line func-names
      .leftJoin('user_follow', function () {
        this.on('user_follow.following_id', '=', 'user.user_id');
        if (requestingUserId) {
          this.andOn(
            'user_follow.follower_id',
            '=',
            knex.raw('?', [requestingUserId])
          );
        }
      })
      .where('article_comment.article_id', articleId)
      .where('article_comment.record_status', RecordStatus.Active)
      .orderBy('article_comment.created_at', 'asc')
      .limit(limit)
      .offset(offset * limit);
    const comments = await query.then((rows) =>
      rows.map((row) => {
        const {
          id,
          body,
          createdAt,
          updatedAt,
          authorId,
          authorUsername,
          authorBio,
          authorImage,
          isFollowing
        } = row;

        const author = {
          id: authorId,
          username: authorUsername,
          bio: authorBio,
          image: authorImage,
          following: isFollowing
        };
        return new DbDtoArticleCommentWithProfile({
          id,
          body,
          createdAt,
          updatedAt,
          author
        });
      })
    );
    return comments;
  }

  async countArticleCommentsByArticleId({
    articleId
  }: CountArticleCommentsByArticleIdInput): CountArticleCommentsByArticleIdOutput {
    const count = await knex
      .table('article_comment')
      .count<{ count: number }[]>('*', { as: 'count' })
      .where('article_id', articleId)
      .where('record_status', RecordStatus.Active)
      .then((response) => response[0]?.count ?? 0);
    return count;
  }

  async getTagsByArticleIds({
    articleIds
  }: GetTagsByArticleIdsInput): GetTagsByArticleIdsOutput {
    if (articleIds.length < 1) {
      return {};
    }
    const tags = await knex
      .select({
        id: 'article_tag.article_tag_id',
        articleId: 'article_tag.article_id',
        tag: 'article_tag.tag',
        recordStatus: 'article_tag.record_status',
        createdAt: 'article_tag.created_at',
        updatedAt: 'article_tag.updated_at'
      })
      .from('article_tag')
      .whereIn('article_id', articleIds)
      .where('record_status', RecordStatus.Active)
      .then((rows) => rows.map((row) => new DbDtoArticleTag(row)));
    const result = groupBy(tags, 'articleId');
    return result;
  }

  async countArticles(filters: CountArticlesInput): CountArticlesOutput {
    const count = await this.getArticleQueryByFilters(filters)
      .count<{ count: number }[]>('*', { as: 'count' })
      .then((response) => response[0]?.count ?? 0);
    return count;
  }

  async deleteArticleById({ id }: DeleteArticleByIdInput): DeleteArticleByIdOutput {
    await knex
      .table('article')
      .update({ record_status: RecordStatus.Deleted })
      .where('article_id', id);
  }

  async deleteArticleCommentById({
    id
  }: DeleteArticleCommentByIdInput): DeleteArticleCommentByIdOutput {
    await knex
      .table('article_comment')
      .update({ record_status: RecordStatus.Deleted })
      .where('article_comment_id', id);
  }

  private getArticleQueryByFilters({
    ids,
    slugs,
    tags,
    author,
    favorited,
    followedBy
  }: GetArticleQueryByFiltersInput): GetArticleQueryByFiltersOutput {
    let query = knex
      .table('article')
      .where('article.record_status', RecordStatus.Active); // Retrieve only active articles

    if (ids) {
      query = query.whereIn('article.article_id', ids);
    }

    if (slugs) {
      query = query.whereIn('article.slug', slugs);
    }

    if (tags && tags.length > 0) {
      query = query.whereIn(
        'article.article_id',
        knex
          .select('article_id')
          .from('article_tag')
          .whereIn('tag', tags)
          .where('record_status', RecordStatus.Active)
      );
    }

    if (author) {
      query = query.whereIn(
        'article.user_id',
        knex
          .select('user_id')
          .from('user')
          .where('username', author)
          .where('record_status', UserStatus.Active)
      );
    }

    if (favorited) {
      query = query.whereIn(
        'article.article_id',
        knex
          .select('article_id')
          .from('article_favorite')
          .where('record_status', RecordStatus.Active)
          .whereIn(
            'user_id',
            knex
              .select('user_id')
              .from('user')
              .where('username', favorited)
              .where('record_status', UserStatus.Active)
          )
      );
    }

    if (followedBy) {
      query = query.whereIn(
        'article.user_id',
        knex
          .select('following_id')
          .from('user_follow')
          .where('follower_id', followedBy)
          .where('record_status', RecordStatus.Active)
      );
    }

    return query;
  }

  async getAvailableTags(): GetAvailableTagsOutput {
    const tags = await knex
      .distinct<{ tag: string }[]>('tag')
      .from('article_tag')
      .whereIn(
        'article_id',
        knex
          .select('article_id')
          .from('article')
          .where('record_status', RecordStatus.Active)
      )
      .then((rows) => rows.map((row) => row.tag));
    return tags;
  }

  async getArticleCommentsByIds({
    ids,
    requestingUserId
  }: GetArticleCommentsByIdsInput): GetArticleCommentsByIdsOutput {
    const comments = await knex
      .select({
        id: 'article_comment.article_comment_id',
        body: 'article_comment.body',
        userId: 'article_comment.user_id',
        userName: 'user.username',
        userBio: 'user.bio',
        userImage: 'user.image',
        isFollowing: knex.raw(
          '(CASE WHEN user_follow_id IS NULL THEN FALSE ELSE TRUE END)'
        ),
        recordStatus: 'article_comment.record_status',
        createdAt: 'article_comment.created_at',
        updatedAt: 'article_comment.updated_at'
      })
      .from('article_comment')
      .leftJoin('user', 'article_comment.user_id', 'user.user_id')
      .leftJoin('user_follow', function () {
        this.on('user_follow.following_id', '=', 'user.user_id');
        if (requestingUserId) {
          this.andOn('user_follow.follower_id', '=', requestingUserId);
        }
      })
      .where('article_comment.record_status', RecordStatus.Active)
      .whereIn('article_comment_id', ids)
      .then((rows) => rows.map((row) => new DbDtoArticleComment(row as any)));
    return sortBy(comments, (comment) => indexOf(ids, comment.id));
  }

  /**
   *
   *
   * Feature: Favorite Articles
   *
   */

  async favoriteArticle({
    articleId,
    userId
  }: FavoriteArticleInput): FavoriteArticleOutput {
    const id = getObjectId();
    await knex
      .insert({
        article_favorite_id: id,
        user_id: userId,
        article_id: articleId
      })
      .into('article_favorite')
      .onConflict(['user_id', 'article_id'])
      .merge(['record_status']);
  }

  async unfavoriteArticle({
    articleId,
    userId
  }: UnfavoriteArticleInput): UnfavoriteArticleOutput {
    await knex
      .table('article_favorite')
      .update({ record_status: RecordStatus.Deleted })
      .where('user_id', userId)
      .where('article_id', articleId);
  }
}
