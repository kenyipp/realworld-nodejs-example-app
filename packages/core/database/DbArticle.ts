import {
	sortBy,
	indexOf,
	isNil,
	isNull,
	groupBy,
	map,
	fromPairs
} from "lodash";
import { v4 as Uuid } from "uuid";
import { RecStatus, Tables, UserStatus } from "@conduit/types";
import { type Knex } from "knex";
import { knex } from "../knex";
import type {
	DbDtoArticle,
	DbDtoArticleComment,
	DbDtoArticleMeta,
	DbDtoArticleTag
} from "./dto";

export class DbArticle {

	/**
	 *
	 * Creates an article in the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.title - The title of the article.
	 * @param {string} input.description - The description of the article.
	 * @param {string} input.body - The body of the article.
	 * @param {string} input.userId - The ID of the user creating the article.
	 *
	 * @returns {Promise<string>} The ID of the created article.
	 *
	 */
	async createArticle({
		title,
		slug,
		description,
		body,
		userId
	}: CreateArticleInput): Promise<string> {
		const articleId = Uuid();
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
			.into(Tables.Article);
		return articleId;
	}

	/**
	 *
	 * Creates tags for an article in the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to which the tags will be attached.
	 * @param {string[]} input.tagList - An array of tags to be attached to the article.
	 *
	 * @returns {Promise<void>}
	 *
	 */
	async createTagsForArticle({
		articleId,
		tagList
	}: CreateTagsForArticleInput): Promise<void> {
		await knex
			.insert(
				tagList.map((tag) => ({
					tag,
					article_id: articleId,
					rec_status: "A"
				}))
			)
			.into(Tables.ArticleTag)
			.onConflict(["tag", "article_id"])
			.merge(["rec_status"]);
	}

	/**
	 *
	 * Updates an article with the specified ID.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input parameters for updating an article.
	 *
	 * @returns {Promise<void>} - A Promise that resolves when the update is complete.
	 *
	 */
	async updateArticleById({
		id,
		title,
		slug,
		description,
		body
	}: UpdateArticleByIdInput): Promise<void> {
		if (!title && !description && !body) {
			return;
		}
		// Create an empty object to store the updates
		const updates: { [field: string]: any } = {};
		if (title) {
			updates.title = title;
		}
		if (description) {
			updates.description = description;
		}
		if (body) {
			updates.body = body;
		}
		if (slug) {
			updates.slug = slug;
		}
		// Update the article in the database with the new values
		await knex
			.table(Tables.Article)
			.update(updates)
			.where("article_id", id);
	}

	/**
	 *
	 * Retrieves the tags associated with the given article ID.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the article ID.
	 * @param {string} input.articleId - The ID of the article.
	 *
	 * @returns {Promise<DbDtoArticleTag>} A promise that resolves to a DbDtoArticleTag object containing the article ID and its associated tags.
	 *
	 */
	async getTagsByArticleId({ articleId }: GetTagsByArticleIdInput): Promise<DbDtoArticleTag> {
		const dbDtoArticleTag = await this.getTagsByArticleIds({ articleIds: [articleId] }).then((docs) => docs[0]);
		return dbDtoArticleTag;
	}

	/**
	 *
	 * Retrieves the tags associated with the given article IDs.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the article IDs.
	 * @param {string[]} input.articleIds - An array of article IDs.
	 *
	 * @returns {Promise<DbDtoArticleTag[]>} A promise that resolves to an array of DbDtoArticleTag objects, each containing an article ID and its associated tags.
	 *
	 */
	async getTagsByArticleIds({ articleIds }: GetTagsByArticleIdsInput): Promise<DbDtoArticleTag[]> {
		if (articleIds.length < 1) {
			return [];
		}
		const tags = await knex
			.select<{ tag: string, articleId: string }[]>({
			articleId: "article_id",
			tag: "tag"
		})
			.from(Tables.ArticleTag)
			.whereIn("article_id", articleIds)
			.where("rec_status", RecStatus.Normal);

		const articleIdToTags = fromPairs(map(groupBy(tags, "articleId"), (values, key) => [key, values.map((doc) => doc.tag)]));
		return articleIds.map((id) => ({ articleId: id, tags: (articleIdToTags[id] || []).sort() }));
	}

	/**
	 *
	 * Retrieves an article by ID.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the article ID.
	 * @param {number} input.id - The ID of the article to retrieve.
	 *
	 * @returns {Promise<object>} A Promise that resolves to the retrieved article object.
	 *
	 */
	async getArticleById({ id }: GetArticleByIdInput): Promise<DbDtoArticle> {
		if (!id) {
			return null;
		}
		// Retrieves an array with the article object.
		const [article] = await this.getArticlesByIds({ ids: [id] });
		return article;
	}

	/**
	 *
	 * Retrieves an article based on its slug.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input containing the slug of the article to retrieve.
	 * @param {string} input.slug - The slug of the article to retrieve.
	 *
	 * @returns {Promise<DbDtoArticle>} - The article object corresponding to the given slug.
	 *
	 */
	async getArticleBySlug({ slug }: GetArticleBySlugInput): Promise<DbDtoArticle> {
		const articleId = await knex
			.first<{ id: string }>({ id: "article_id" })
			.from(Tables.Article)
			.where("slug", slug)
			.where("rec_status", RecStatus.Normal)
			.then((article) => article?.id);
		const article = await this.getArticleById({ id: articleId });
		return article;
	}

	/**
	 *
	 * Retrieves articles by their IDs.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing the IDs of the articles to retrieve.
	 * @param {number[]} input.ids - An array of article IDs to retrieve.
	 *
	 * @returns {Promise<object[]>} A Promise that resolves to an array of retrieved article objects.
	 *
	 */
	async getArticlesByIds({ ids }: GetArticlesByIdsInput): Promise<DbDtoArticle[]> {
		// If no article IDs are provided, an empty array is returned.
		if (ids.length < 1) {
			return [];
		}
		// Queries the database for articles with the provided IDs.
		const articles = await knex
			.select({
				id: "article_id",
				title: "title",
				slug: "slug",
				description: "description",
				body: "body",
				userId: "user_id",
				statusId: "rec_status",
				createdAt: "created_at",
				updatedAt: "updated_at"
			})
			.from(Tables.Article)
			.whereIn("article_id", ids)
			.where("rec_status", RecStatus.Normal);
		// Returns an array of retrieved article objects.
		return sortBy(articles, (article) => indexOf(ids, article.id));
	}

	/**
	 *
	 * Retrieves an array of article IDs that match the given filters.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} filters - The filters to apply to the search.
	 *
	 * @returns {Promise<string[]>} - An array of article IDs that match the filters.
	 *
	 */
	async getArticleIdsByFilters(filters: GetArticleIdsByFiltersInput): Promise<string[]> {
		const ids = await this
			.getQueryByFilters(filters)
			.select<{ id: string }[]>({ id: "article_id" })
			.offset(filters.limit * filters.offset)
			.limit(filters.limit)
			.orderBy("created_at", "desc")
			.then((response) => response.map(({ id }) => id));
		return ids;
	}

	/**
	 *
	 * Counts the number of articles that match the given filters.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} filters - The filters to apply to the search.
	 *
	 * @returns {Promise<number>} - The number of articles that match the filters.
	 *
	 */
	async countArticlesByFilters(filters: CountArticlesByFiltersInput): Promise<number> {
		const count = await this
			.getQueryByFilters(filters)
			.count<{ count: number }[]>("*", { as: "count" })
			.then((response) => response[0].count);
		return count;
	}

	/**
	 *
	 * Returns a knex query object for retrieving articles based on the given filters.
	 *
	 * @param {ArticleFilters} filters - The filters to apply to the query.
	 *
	 * @returns {Knex.QueryBuilder} - The knex query object.
	 * @private
	 *
	 */
	private getQueryByFilters(filters: ArticleFilters): Knex.QueryBuilder {
		let query = knex
			.table(Tables.Article)
			.where("rec_status", RecStatus.Normal);

		if (filters.tag) {
			query = query.whereIn(
				"article_id",
				knex
					.select("article_id")
					.from(Tables.ArticleTag)
					.where("tag", filters.tag)
					.where("rec_status", RecStatus.Normal)
			);
		}

		if (filters.author) {
			query = query.whereIn(
				"user_id",
				knex
					.select("user_id")
					.from(Tables.User)
					.where("username", filters.author)
					.where("status_id", UserStatus.Normal)
			);
		}

		if (filters.favorited) {
			query = query.whereIn(
				"article_id",
				knex
					.select("article_id")
					.from(Tables.ArticleFavorite)
					.where("rec_status", RecStatus.Normal)
					.whereIn(
						"user_id",
						knex
							.select("user_id")
							.from(Tables.User)
							.where("username", filters.favorited)
							.where("status_id", UserStatus.Normal)
					)
			);
		}

		if (filters.followedBy) {
			query = query.whereIn(
				"user_id",
				knex
					.select("following_id")
					.from(Tables.UserFollow)
					.where("follower_id", filters.followedBy)
					.where("rec_status", RecStatus.Normal)
			);
		}

		return query;
	}

	/**
	 *
	 * Deletes an article from the database by its ID.
	 *
	 * @async
	 * @function
	 * @param {object} input - An object containing the ID of the article to be deleted.
	 *
	 * @throws {Error} - Throws an error if there is an issue with deleting the article.
	 * @returns {Promise<void>} - A Promise that resolves with no value upon successful deletion of the article.
	 *
	 */
	async deleteArticleById({ id }: DeleteArticleByIdInput): Promise<void> {
		await knex
			.table(Tables.Article)
			.update({ rec_status: RecStatus.Deleted })
			.where("article_id", id);
	}

	/**
	 *
	 * Creates a new article comment and returns the ID of the newly created comment id.
	 *
	 * @async
	 * @function createArticleComment
	 *
	 * @param {Object} params - An object containing the parameters for creating a new article comment.
	 * @param {string} params.articleId - The ID of the article for which to create a new comment.
	 * @param {string} params.body - The body text of the new comment.
	 * @param {string} params.userId - The ID of the user who created the new comment.
	 *
	 * @returns {Promise<string>} A Promise that resolves to the ID of the newly created comment.
	 *
	 */
	async createArticleComment({ articleId, body, userId }: CreateArticleCommentInput): Promise<string> {
		const articleCommentId = Uuid();
		await knex
			.table(Tables.ArticleComment)
			.insert({
				article_comment_id: articleCommentId,
				article_id: articleId,
				body,
				user_id: userId
			});
		return articleCommentId;
	}

	/**
	 *
	 * Retrieves article comments for a given article ID.
	 *
	 * @async
	 * @function getArticleCommentsByArticleId
	 *
	 * @param {Object} input - The input object containing the article ID.
	 * @param {number} input.articleId - The ID of the article to retrieve comments for.
	 *
	 * @returns {Promise<DbDtoArticleComment[]>} A promise that resolves with an array of database DTOs representing the article comments.
	 * @throws {Error} If the database query fails for any reason.
	 *
	 */
	async getArticleCommentsByArticleId({ articleId }: GetArticleCommentsByArticleIdInput): Promise<DbDtoArticleComment[]> {
		const comments = await knex
			.select<DbDtoArticleComment[]>({
			id: "article_comment_id",
			body: "body",
			userId: "user_id",
			recStatus: "rec_status",
			createdAt: "created_at",
			updatedAt: "updated_at"
		})
			.from(Tables.ArticleComment)
			.where("rec_status", RecStatus.Normal)
			.where("article_id", articleId);
		return comments;
	}

	/**
	 *
	 * Retrieves an array of comment IDs for a given article ID.
	 *
	 * @async
	 * @function getArticleCommentIdsByArticleId
	 *
	 * @param {Object} params - An object containing the parameters for retrieving the comment IDs.
	 * @param {string} params.articleId - The ID of the article for which to retrieve comment IDs.
	 *
	 * @returns {Promise<string[]>} A Promise that resolves to an array of comment IDs.
	 *
	 */
	async getArticleCommentIdsByArticleId({ articleId }: GetArticleCommentIdsByArticleIdInput): Promise<string[]> {
		const ids = await knex
			.select<{ id: string }[]>({ id: "article_comment_id" })
			.from(Tables.ArticleComment)
			.where("rec_status", RecStatus.Normal)
			.where("article_id", articleId)
			.orderBy("created_at", "desc")
			.then((response) => response.map(({ id }) => id));
		return ids;
	}

	/**
	 *
	 * Counts the number of comments for a given article ID.
	 *
	 * @async
	 * @function countArticleCommentsByArticleId
	 *
	 * @param {Object} params - An object containing the parameters for counting the comments.
	 * @param {string} params.articleId - The ID of the article for which to count the comments.
	 *
	 * @returns {Promise<number>} A Promise that resolves to the number of comments for the given article ID.
	 *
	 */
	async countArticleCommentsByArticleId({ articleId }: CountArticleCommentsByArticleIdInput): Promise<number> {
		const count = await knex
			.count<{ count: number }[]>("*", { as: "count" })
			.from(Tables.ArticleComment)
			.where("rec_status", RecStatus.Normal)
			.where("article_id", articleId)
			.then((response) => response[0].count);
		return count;
	}

	/**
	 *
	 * Retrieves an array of article comments by their IDs.
	 *
	 * @async
	 * @function getArticleCommentsByIds
	 *
	 * @param {Object} params - An object containing the IDs of the article comments to retrieve.
	 * @param {string[]} params.ids - An array of article comment IDs to retrieve.
	 *
	 * @returns {Promise<DbDtoArticleComment[]>} A Promise that resolves to an array of article comment objects.
	 *
	 */
	async getArticleCommentsByIds({ ids }: GetArticleCommentsByIdsInput): Promise<DbDtoArticleComment[]> {
		const comments = await knex
			.select<DbDtoArticleComment[]>({
			id: "article_comment_id",
			body: "body",
			userId: "user_id",
			recStatus: "rec_status",
			createdAt: "created_at",
			updatedAt: "updated_at"
		})
			.from(Tables.ArticleComment)
			.where("rec_status", RecStatus.Normal)
			.whereIn("article_comment_id", ids);
		return sortBy(comments, (comment) => indexOf(ids, comment.id));
	}

	/**
	 *
	 * Retrieves an article comment by its ID.
	 *
	 * @async
	 * @function getArticleCommentById
	 *
	 * @param {Object} params - An object containing the ID of the article comment to retrieve.
	 * @param {string} params.id - The ID of the article comment to retrieve.
	 *
	 * @returns {Promise<DbDtoArticleComment>} A Promise that resolves to an article comment object.
	 *
	 */
	async getArticleCommentById({ id }: GetArticleCommentByIdInput): Promise<DbDtoArticleComment> {
		const comment = await this
			.getArticleCommentsByIds({ ids: [id] })
			.then((comments) => comments[0]);
		return comment;
	}

	/**
	 *
	 * Deletes an article comment by its ID.
	 *
	 * @async
	 * @function deleteArticleCommentById
	 *
	 * @param {Object} params - An object containing the ID of the article comment to delete.
	 * @param {string} params.id - The ID of the article comment to delete.
	 *
	 * @returns {Promise<void>} A Promise that resolves when the article comment has been deleted.
	 *
	 */
	async deleteArticleCommentById({ id }: DeleteArticleCommentByIdInput): Promise<void> {
		await knex
			.table(Tables.ArticleComment)
			.update({ rec_status: RecStatus.Deleted })
			.where("article_comment_id", id);
	}

	/**
	 *
	 * Add a user's favorite article to the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to favorite.
	 * @param {string} input.userId - The ID of the user who is favoriting the article.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of the database operation.
	 *
	 */
	async favoriteArticle({ articleId, userId }: FavoriteArticleInput): Promise<void> {
		await knex
			.insert({
				article_favorite_id: Uuid(),
				user_id: userId,
				article_id: articleId
			})
			.into(Tables.ArticleFavorite)
			.onConflict(["user_id", "article_id"])
			.merge(["rec_status"]);
	}

	/**
	 *
	 * Remove a user's favorite article from the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to unfavorite.
	 * @param {string} input.userId - The ID of the user who is unfavoriting the article.
	 *
	 * @returns {Promise<void>} Promise object representing the completion of the database operation.
	 *
	 */
	async unfavoriteArticle({ articleId, userId }: UnfavoriteArticleInput): Promise<void> {
		await knex
			.table(Tables.ArticleFavorite)
			.update({ rec_status: RecStatus.Deleted })
			.where("user_id", userId)
			.where("article_id", articleId);
	}

	/**
	 *
	 * Check if a user has favorited an article.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.articleId - The ID of the article to check.
	 * @param {string} input.userId - The ID of the user to check.
	 *
	 * @returns {Promise<boolean>} Promise object representing whether the user has favorited the article or not.
	 *
	 */
	async isArticleFavorited({ articleId, userId }: IsArticleFavoritedInput): Promise<boolean> {
		const isFavorited = await knex
			.first<{ id: string }>({ id: "article_favorite_id" })
			.from(Tables.ArticleFavorite)
			.where({ rec_status: RecStatus.Normal })
			.where("user_id", userId)
			.where("article_id", articleId)
			.then((response) => !isNil(response));
		return isFavorited;
	}

	/**
	 *
	 * Retrieves metadata for a single article based on its ID
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the following:
	 * @param {number} input.id - The ID of the article to retrieve metadata for
	 * @param {number} input.userId - The ID of the user retrieving the metadata
	 *
	 * @returns {Promise<DbDtoArticleMeta>} A Promise that resolves to an DbDtoArticleMeta object
	 * @throws {Error} If an error occurs while retrieving the metadata
	 *
	 */
	async getArticleMetaById({ id, userId }: GetArticleMetaByIdInput): Promise<DbDtoArticleMeta> {
		const meta = await this
			.getArticleMetaByIds({ ids: [id], userId })
			.then((docs) => docs[0]);
		return meta;
	}

	/**
	 *
	 * Retrieves metadata for articles based on their IDs
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object containing the following:
	 * @param {Array<number>} input.ids - The IDs of the articles to retrieve metadata for
	 * @param {number} input.userId - The ID of the user retrieving the metadata
	 *
	 * @returns {Promise<Array<DbDtoArticleMeta>>} A Promise that resolves to an array of DbDtoArticleMeta objects
	 * @throws {Error} If an error occurs while retrieving the metadata
	 *
	 */
	async getArticleMetaByIds({ ids, userId }: GetArticleMetaByIdsInput): Promise<DbDtoArticleMeta[]> {
		if (ids.length < 1) {
			return [];
		}

		const meta: DbDtoArticleMeta[] = await knex
			.select({
				id: `${Tables.Article}.article_id`,
				favorited: knex
					.select("user_id")
					.from(Tables.ArticleFavorite)
					.where(`${Tables.ArticleFavorite}.user_id`, userId || Uuid())
					.whereRaw(`${Tables.ArticleFavorite}.article_id = ${Tables.Article}.article_id`)
					.where(`${Tables.ArticleFavorite}.rec_status`, RecStatus.Normal),
				favoritesCount: knex
					.count()
					.from(Tables.ArticleFavorite)
					.whereRaw(`${Tables.ArticleFavorite}.article_id = ${Tables.Article}.article_id`)
					.where(`${Tables.ArticleFavorite}.rec_status`, RecStatus.Normal),
				following: knex
					.select(`${Tables.UserFollow}.follower_id`)
					.from(Tables.UserFollow)
					.where(`${Tables.UserFollow}.follower_id`, userId || Uuid())
					.whereRaw(`${Tables.UserFollow}.following_id = ${Tables.Article}.user_id`)
					.where(`${Tables.UserFollow}.rec_status`, RecStatus.Normal)
			})
			.from(Tables.Article)
			.leftJoin(
				Tables.ArticleFavorite,
				`${Tables.Article}.article_id`,
				`${Tables.ArticleFavorite}.article_id`
			)
			.whereIn(`${Tables.Article}.article_id`, ids)
			.then((rows) => rows.map((row) => {
				row.favorited = !isNull(row.favorited);
				row.following = !isNull(row.following);
				return row;
			}));
		return meta;
	}

	/**
	 *
	 * Retrieves all distinct tags associated with articles that have normal record status.
	 *
	 * @async
	 * @function
	 *
	 * @returns {Promise<string[]>} - An array of distinct tags.
	 *
	 */
	async getAllTags(): Promise<string[]> {
		const tags = await knex
			.distinct<{ tag: string }[]>("tag")
			.from(Tables.ArticleTag)
			.whereIn(
				"article_id",
				knex
					.select("article_id")
					.from(Tables.Article)
					.where("rec_status", RecStatus.Normal)
			)
			.then((rows) => rows.map((row) => row.tag));
		return tags;
	}

}

export interface CreateArticleInput {
	title: string;
	slug: string;
	description: string;
	body: string;
	userId: string;
}

export interface CreateTagsForArticleInput {
	articleId: string;
	tagList: string[];
}

export interface GetTagsByArticleIdInput {
	articleId: string;
}

export interface GetTagsByArticleIdsInput {
	articleIds: string[];
}

export interface UpdateArticleByIdInput {
	id: string;
	title?: string;
	slug?: string;
	description?: string;
	body?: string;
}

export interface GetArticleByIdInput {
	id: string;
}

export interface GetArticleBySlugInput {
	slug: string;
}

export interface GetArticlesByIdsInput {
	ids: string[];
}

export interface ArticleFilters {
	tag?: string;
	author?: string;
	favorited?: string;
	followedBy?: string;
}

export type GetArticleIdsByFiltersInput = ArticleFilters & {
	limit: number;
	offset: number;
};

export type CountArticlesByFiltersInput = ArticleFilters;

export interface DeleteArticleByIdInput {
	id: string;
}

export interface CreateArticleCommentInput {
	articleId: string;
	body: string;
	userId: string;
}

export interface GetArticleCommentIdsByArticleIdInput {
	articleId: string;
}

export interface CountArticleCommentsByArticleIdInput {
	articleId: string;
}

export interface GetArticleCommentsByIdsInput {
	ids: string[];
}

export interface GetArticleCommentByIdInput {
	id: string;
}

export interface DeleteArticleCommentByIdInput {
	id: string;
}

export interface FavoriteArticleInput {
	articleId: string;
	userId: string;
}

export interface UnfavoriteArticleInput {
	articleId: string;
	userId: string;
}

export interface IsArticleFavoritedInput {
	articleId: string;
	userId: string;
}

export interface GetArticleMetaByIdInput {
	id: string;
	userId: string;
}

export interface GetArticleMetaByIdsInput {
	ids: string[];
	userId?: string;
}

export interface GetArticleCommentsByArticleIdInput {
	articleId: string;
}
