import {
	fromPairs,
	indexOf,
	isNil,
	isUndefined,
	sortBy
} from "lodash";
import { v4 as Uuid } from "uuid";
import { RecStatus, Tables, UserStatus } from "@conduit/types";
import { DbDtoUser } from "./dto";
import { knex } from "../knex";

export class DbUser {

	/**
	 *
	 * Retrieves user data for an array of user IDs.
	 *
	 * @async
	 * @function getUserByIds
	 *
	 * @param {Object} input - The input object containing the user IDs.
	 * @param {number[]} input.ids - An array of user IDs to retrieve data for.
	 *
	 * @returns {Promise<DbDtoUser[]>} A promise that resolves with an array of database DTOs representing the users.
	 * @throws {Error} If the database query fails for any reason.
	 *
	 */
	async getUserByIds({ ids }: GetUserByIdsInput): Promise<DbDtoUser[]> {
		if (ids.length < 1) {
			return [];
		}
		const users = await knex
			.select<DbDtoUser[]>({
			id: "user_id",
			username: "username",
			email: "email",
			bio: "bio",
			image: "image",
			hash: "hash",
			statusId: "status_id",
			createdAt: "created_at",
			updatedAt: "updated_at"
		})
			.from(Tables.User)
			.whereIn("user_id", ids);
		return sortBy(users, (user) => indexOf(ids, user.id));
	}

	/**
	 *
	 * Get a user by their ID from the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - An object containing input parameters.
	 * @param {number} input.id - The ID of the user to retrieve.
	 *
	 * @returns {Promise<DbDtoUser|null>} - A promise that resolves to the user object if found, or null if not found.
	 *
	 */
	async getUserById({ id }: GetUserByIdInput): Promise<DbDtoUser> {
		const user = await this.getUserByIds({ ids: [id] }).then((users) => users[0]);
		return user;
	}

	/**
	 *
	 * Get a user by their email from the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - An object containing input parameters.
	 * @param {string} input.email - The email address of the user to retrieve.
	 *
	 * @returns {Promise<DbDtoUser>} - A promise that resolves to the user object if found.
	 *
	 */
	async getUserByEmail({ email }: GetUserByEmailInput): Promise<DbDtoUser> {
		const { id } = await knex
			.first<{ id: string }>({ id: "user_id" })
			.from(Tables.User)
			.where("email", email)
			.then((row) => row ?? { id: null });
		const user = await this.getUserById({ id });
		return user;
	}

	/**
	 *
	 * Get a user by their username from the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - An object containing input parameters.
	 * @param {string} input.email - The email address of the user to retrieve.
	 *
	 * @returns {Promise<DbDtoUser>} - A promise that resolves to the user object if found.
	 *
	 */
	async getUserByUsername({ username }: GetUserByUsernameInput): Promise<DbDtoUser> {
		const { id } = await knex
			.first<{ id: string }>({ id: "user_id" })
			.from(Tables.User)
			.where("username", username)
			.then((row) => row ?? { id: null });
		const user = await this.getUserById({ id });
		return user;
	}

	/**
	 *
	 * Creates a new user with the given input data
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input object.
	 * @param {string} input.username - The username of the new user.
	 * @param {string} input.email - The email of the new user.
	 * @param {string} input.bio - The bio of the new user.
	 * @param {string} input.image - The image URL of the new user.
	 * @param {string} input.hash - The password hash of the new user.
	 *
	 * @returns {Promise<string>} A promise that resolves to the user ID of the newly created user.
	 *
	 */
	async createUser({
		username, email, bio, image, hash
	}: CreateUserInput): Promise<string> {
		const userId = Uuid();
		await knex
			.insert({
				user_id: userId,
				username,
				email,
				bio,
				image,
				hash
			})
			.into(Tables.User);
		return userId;
	}

	/**
	 *
	 * Updates an existing user in the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - An object containing input parameters for updating an existing user.
	 *
	 * @returns {Promise<void>} - A promise that resolves if the update was successful.
	 * @throws {Error} - If an error occurs during the update of the user.
	 *
	 */
	async updateUser({
		id, email, username, hash, image, bio
	}: UpdateUserInput): Promise<void> {
		if (!email && !username && !hash && !image && !bio) {
			return;
		}
		const updates: { [field: string]: any } = {};
		if (!isUndefined(email)) {
			updates.email = email;
		}
		if (!isUndefined(username)) {
			updates.username = username;
		}
		if (!isUndefined(hash)) {
			updates.hash = hash;
		}
		if (!isUndefined(image)) {
			updates.image = image;
		}
		if (!isUndefined(bio)) {
			updates.bio = bio;
		}
		await knex
			.table(Tables.User)
			.update(updates)
			.where("user_id", id);
	}

	/**
	 *
	 * Checks if a user with the given username or email already exists in the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - The input parameters for the function.
	 * @param {string} input.username - The username to check.
	 * @param {string} input.email - The email to check.
	 *
	 * @returns {Promise<boolean>} - A promise that resolves to true if the user exists, false otherwise.
	 *
	 */
	async isUserExist({ username, email }: IsUserExistInput): Promise<boolean> {
		if (!username && !email) {
			return false;
		}
		let query = knex
			.first<{ userId: string }>({ userId: "user_id" })
			.from(Tables.User);
		if (username) {
			query = query.orWhere("username", username);
		}
		if (email) {
			query = query.orWhere("email", email);
		}
		const result = await query;
		return !!(result);
	}

	/**
	 *
	 * Add a new follow record to the UserFollow table.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input object containing the follower and following user IDs.
	 * @param {string} input.followerId - The ID of the user who is following.
	 * @param {string} input.followingId - The ID of the user who is being followed.
	 *
	 * @returns {Promise<void>} - A Promise that resolves when the follow record has been inserted.
	 * @throws {Error} - If the follow record cannot be inserted into the database.
	 *
	 */
	async followUser({ followerId, followingId }: FollowUserInput): Promise<void> {
		await knex
			.insert({
				user_follow_id: Uuid(),
				follower_id: followerId,
				following_id: followingId,
				rec_status: "A"
			})
			.into(Tables.UserFollow)
			.onConflict(["follower_id", "following_id"])
			.merge();
	}

	/**
	 *
	 * Remove a follow record from the UserFollow table.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input object containing the follower and following user IDs.
	 * @param {string} input.followerId - The ID of the user who is following.
	 * @param {string} input.followingId - The ID of the user who is being followed.
	 *
	 * @returns {Promise<void>} - A Promise that resolves when the follow record has been deleted.
	 * @throws {Error} - If the follow record cannot be deleted from the database.
	 *
	 */
	async unfollowUser({ followerId, followingId }: UnfollowUserInput): Promise<void> {
		await knex
			.table(Tables.UserFollow)
			.update({ rec_status: RecStatus.Deleted })
			.where("follower_id", followerId)
			.where("following_id", followingId);
	}

	/**
	 *
	 * Check whether a user is following another user.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input object containing the follower and following user IDs.
	 * @param {string} input.followerId - The ID of the user who is following.
	 * @param {string} input.followingId - The ID of the user who is being followed.
	 *
	 * @returns {Promise<boolean>} - A Promise that resolves with a boolean indicating whether the follower user is following the following user.
	 * @throws {Error} - If the database query fails.
	 *
	 */
	async isFollowing({ followerId, followingId }: IsFollowingInput): Promise<boolean> {
		const id = await knex
			.first<{ id: string }>({ id: "user_follow_id" })
			.from(Tables.UserFollow)
			.where("rec_status", "A")
			.where("follower_id", followerId)
			.where("following_id", followingId);
		return !isNil(id);
	}

	/**
	 *
	 * Retrieves whether or not a user is following an array of users.
	 *
	 * @async
	 * @function getIsUsersFollowingByUserId
	 *
	 * @param {Object} input - The input object containing the follower ID and following IDs.
	 * @param {string} input.followerId - The ID of the user who is following.
	 * @param {string[]} input.followingIds - An array of user IDs to check if they are being followed.
	 *
	 * @returns {Promise<GetIsUsersFollowingByUserIdsOutput>} A promise that resolves with an object mapping the given user IDs to boolean values indicating whether or not they are being followed.
	 * @throws {Error} If the database query fails for any reason.
	 *
	 */
	async getIsUsersFollowingByUserId({ followerId, followingIds }: GetIsUsersFollowingByUserIdsInput): Promise<GetIsUsersFollowingByUserIdsOutput> {
		if (followingIds.length < 1 || isNil(followerId)) {
			return fromPairs(followingIds.map((id) => [id, false]));
		}
		const ids = await knex
			.select<{ followingId: string }[]>({ followingId: "following_id" })
			.from(Tables.UserFollow)
			.where("follower_id", followerId)
			.whereIn("following_id", followingIds)
			.then((rows) => rows.map((row) => row.followingId));
		return fromPairs(followingIds.map((id) => [id, ids.includes(id)]));
	}

	/**
	 *
	 * Ban user by their ID
	 *
	 * @async
	 * @function banUserById
	 *
	 * @param {Object} input - Object containing the ID of the user to ban.
	 * @param {string} input.id - ID of the user to ban.
	 *
	 * @returns {Promise<void>} Promise that resolves with no value on success or throws an error on failure.
	 *
	 */
	async banUserById({ id }: BanUserByIdInput): Promise<void> {
		await knex
			.table(Tables.User)
			.update({ status_id: UserStatus.Banned })
			.where("user_id", id);
	}

	/**
	 *
	 * Marks all the content created by a user as deleted.
	 *
	 * @async
	 * @param {Object} input - The input object.
	 * @param {number} input.userId - The ID of the user whose content should be marked as deleted.
	 *
	 * @returns {Promise<void>} A Promise that resolves when the deletion is complete.
	 *
	 */
	async hiddenUserContent({ userId }: HiddenUserContentInput): Promise<void> {
		await knex
			.table(Tables.Article)
			.update({ rec_status: RecStatus.Deleted })
			.where("user_id", userId);
		await knex
			.table(Tables.ArticleComment)
			.update({ rec_status: RecStatus.Deleted })
			.where("user_id", userId);
	}

}

export interface CreateUserInput {
	username: string;
	email: string;
	bio: string;
	image: string;
	hash: string;
}

export interface UpdateUserInput {
	id: string;
	email?: string;
	username?: string;
	hash?: string,
	image?: string;
	bio?: string;
}

export interface IsUserExistInput {
	username?: string;
	email?: string;
}

export interface GetUserByIdsInput {
	ids: string[];
}

export interface GetUserByIdInput {
	id: string;
}

export interface GetUserByEmailInput {
	email: string;
}

export interface GetUserByUsernameInput {
	username: string;
}

export interface FollowUserInput {
	followerId: string;
	followingId: string;
}

export interface UnfollowUserInput {
	followerId: string;
	followingId: string;
}

export interface IsFollowingInput {
	followerId: string;
	followingId: string;
}

export interface BanUserByIdInput {
	id: string;
}

export interface HiddenUserContentInput {
	userId: string;
}

export interface GetIsUsersFollowingByUserIdsInput {
	followerId: string;
	followingIds: string[];
}

export interface GetIsUsersFollowingByUserIdsOutput {
	[userId: string]: boolean;
}
