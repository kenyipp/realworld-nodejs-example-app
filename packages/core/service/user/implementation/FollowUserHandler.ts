import { isNil } from "lodash";
import {
	InvalidFollowError,
	UserNotFoundError
} from "../error";
import {
	type RepoUser,
	type FollowUserInput,
	type UnfollowUserInput,
	type IsFollowingInput
} from "../../../repository/RepoUser";

export class FollowUserHandler {

	private repoUser: RepoUser;

	constructor({ repoUser }: FollowUserHandlerConstructor) {
		this.repoUser = repoUser;
	}

	/**
	 *
	 * Follow a user if not already followed.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input object containing the IDs of the follower and the user to follow.
	 * @param {number} input.followerId - The ID of the user who wants to follow.
	 * @param {number} input.followingId - The ID of the user to follow.
	 *
	 * @throws {InvalidFollowError} - If the follower is attempting to follow themselves,
	 * the follower is already following the targeted user, or if there is an issue with the validation.
	 * @throws {UserNotFoundError} - If the user to follow is not found in the database.
	 *
	 */
	async followUser({ followerId, followingId }: FollowUserInput): Promise<void> {
		if (followerId === followingId) {
			throw new InvalidFollowError({ message: "You cannot follow yourself" });
		}
		await this.validateFollowingId({ followingId });
		const isFollowing = await this.repoUser.isFollowing({ followerId, followingId });
		if (isFollowing) {
			throw new InvalidFollowError({ message: "You are already following this user" });
		}
		await this.repoUser.followUser({ followerId, followingId });
	}

	/**
	 *
	 * Unfollow a user if currently followed.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} input - The input object containing the IDs of the follower and the user to unfollow.
	 * @param {number} input.followerId - The ID of the user who wants to unfollow.
	 * @param {number} input.followingId - The ID of the user to unfollow.
	 *
	 * @throws {InvalidFollowError} - If the follower is attempting to unfollow themselves,
	 * @throws {UserNotFoundError} - If the user to follow is not found in the database.
	 *
	 * the follower is not following the targeted user, or if there is an issue with the validation.
	 *
	 */
	async unfollowUser({ followerId, followingId }: UnfollowUserInput): Promise<void> {
		if (followerId === followingId) {
			throw new InvalidFollowError({ message: "You cannot unfollow yourself" });
		}
		await this.validateFollowingId({ followingId });
		const isFollowing = await this.repoUser.isFollowing({ followerId, followingId });
		if (!isFollowing) {
			throw new InvalidFollowError({ message: "You cannot unfollow this user because you are not currently following them" });
		}
		await this.repoUser.unfollowUser({ followerId, followingId });
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
		if (followerId === followingId) {
			return false;
		}
		const isFollowing = await this.repoUser.isFollowing({ followerId, followingId });
		return isFollowing;
	}

	/**
	 *
	 * Validate that the user to follow exists.
	 *
	 * @async
	 * @function
	 *
	 * @param {object} validateFollowingIdInput - The input object containing the ID of the user to follow.
	 * @param {number} validateFollowingIdInput.followingId - The ID of the user to follow.
	 *
	 * @throws {UserNotFoundError} - If the user to follow is not found in the database.
	 *
	 */
	private async validateFollowingId({ followingId }: ValidateFollowingIdInput): Promise<void> {
		const user = await this.repoUser.getUserById({ id: followingId });
		if (isNil(user)) {
			throw new UserNotFoundError();
		}
	}

}

export interface FollowUserHandlerConstructor {
	repoUser: RepoUser;
}

export interface ValidateFollowingIdInput {
	followingId: string;
}

export {
	FollowUserInput,
	UnfollowUserInput,
	IsFollowingInput
};
