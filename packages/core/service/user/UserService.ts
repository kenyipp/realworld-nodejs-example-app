import { DbDtoUser } from "../../database/dto";
import {
	type GetIsUsersFollowingByUserIdsInput,
	type GetIsUsersFollowingByUserIdsOutput,
	type GetUserByEmailInput,
	type GetUserByIdInput,
	type GetUserByIdsInput,
	type GetUserByUsernameInput,
	RepoUser
} from "../../repository/RepoUser";
import { AuthService } from "../auth/AuthService";
import {
	type BanUserByIdInput,
	BanUserHandler,
	CreateUserHandler,
	type CreateUserInput,
	FollowUserHandler,
	type FollowUserInput,
	type IsFollowingInput,
	type UnfollowUserInput,
	UpdateUserHandler,
	type UpdateUserInput
} from "./implementation";

export class UserService {
	private repoUser: RepoUser;
	private createUserHandler: CreateUserHandler;
	private updateUserHandler: UpdateUserHandler;
	private followUserHandler: FollowUserHandler;
	private banUserHandler: BanUserHandler;

	constructor({ repoUser, authService }: UserServiceConstructor) {
		this.repoUser = repoUser;
		this.createUserHandler = new CreateUserHandler({
			authService,
			repoUser
		});
		this.updateUserHandler = new UpdateUserHandler({
			authService,
			repoUser
		});
		this.followUserHandler = new FollowUserHandler({ repoUser });
		this.banUserHandler = new BanUserHandler({ repoUser });
	}

	/**
	 *
	 * Creates a new user in the database.
	 *
	 * @async
	 * @function
	 *
	 * @param {Object} input - An object containing input parameters.
	 *
	 * @param {string} input.email - The email address of the new user.
	 * @param {string} input.username - The username of the new user.
	 * @param {string} input.password - The password of the new user.
	 * @param {string} input.image - The profile image of the new user.
	 * @param {string} input.bio - The bio of the new user.
	 *
	 * @returns {Promise<DbDtoUser>} - A promise that resolves to the user object of the created user.
	 * @throws {UserExistError} - If a user with the same email or username already exists in the database.
	 * @throws {Error} - If input is not valid or if an error occurs during the creation of the user.
	 *
	 */
	async createUser(input: CreateUserInput): Promise<DbDtoUser> {
		const user = await this.createUserHandler.execute(input);
		return user;
	}

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
		const users = await this.repoUser.getUserByIds({ ids });
		return users;
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
		const user = await this.repoUser.getUserById({ id });
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
	 * @param {number} input.username - The username of the user to retrieve.
	 *
	 * @returns {Promise<DbDtoUser|null>} - A promise that resolves to the user object if found, or null if not found.
	 *
	 */
	async getUserByUsername({
		username
	}: GetUserByUsernameInput): Promise<DbDtoUser> {
		const user = await this.repoUser.getUserByUsername({ username });
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
	 * @param {number} input.email - The email of the user to retrieve.
	 *
	 * @returns {Promise<DbDtoUser|null>} - A promise that resolves to the user object if found, or null if not found.
	 *
	 */
	async getUserByEmail({ email }: GetUserByEmailInput): Promise<DbDtoUser> {
		const user = await this.repoUser.getUserByEmail({ email });
		return user;
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
	async getIsUsersFollowingByUserId({
		followerId,
		followingIds
	}: GetIsUsersFollowingByUserIdsInput): Promise<GetIsUsersFollowingByUserIdsOutput> {
		const isUsersFollowingByUserId =
			await this.repoUser.getIsUserFollowingByUserIds({
				followerId,
				followingIds
			});
		return isUsersFollowingByUserId;
	}

	/**
	 *
	 * Updates an existing user with the given input parameters.
	 *
	 * @async
	 * @function
	 *
	 * @param {UpdateUserInput} input - An object containing the input parameters for updating an existing user.
	 *
	 * @returns {Promise<DbDtoUser>} - A promise that resolves with the updated user.
	 * @throws {UserNotFoundError} - If the user with the given ID does not exist in the database.
	 * @throws {Error} - If an error occurs while updating the user.
	 *
	 */
	async updateUserById(input: UpdateUserInput): Promise<DbDtoUser> {
		const user = await this.updateUserHandler.execute(input);
		return user;
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
	async followUser({
		followerId,
		followingId
	}: FollowUserInput): Promise<void> {
		await this.followUserHandler.followUser({ followerId, followingId });
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
	async unfollowUser({
		followerId,
		followingId
	}: UnfollowUserInput): Promise<void> {
		await this.followUserHandler.unfollowUser({ followerId, followingId });
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
	async isFollowing({
		followerId,
		followingId
	}: IsFollowingInput): Promise<boolean> {
		const isFollowing = await this.followUserHandler.isFollowing({
			followerId,
			followingId
		});
		return isFollowing;
	}

	/**
	 *
	 * Bans a user by their ID.
	 *
	 * @async
	 * @param {BanUserByIdInput} input - The input containing the ID of the user to ban.
	 *
	 * @returns {Promise<void>} A Promise representing the completion of the ban operation.
	 * @throws {UserNotFoundError} If the user with the specified ID is not found.
	 *
	 */
	async banUserById({ id }: BanUserByIdInput): Promise<void> {
		await this.banUserHandler.execute({ id });
	}
}

interface UserServiceConstructor {
	repoUser: RepoUser;
	authService: AuthService;
}
