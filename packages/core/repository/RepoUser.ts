import {
	type BanUserByIdInput,
	type CreateUserInput,
	DbUser,
	type FollowUserInput,
	type GetIsUsersFollowingByUserIdsInput,
	type GetIsUsersFollowingByUserIdsOutput,
	type GetUserByEmailInput,
	type GetUserByIdInput,
	type GetUserByIdsInput,
	type GetUserByUsernameInput,
	type HiddenUserContentInput,
	type IsFollowingInput,
	type IsUserExistInput,
	type UnfollowUserInput,
	type UpdateUserInput
} from "../database/DbUser";
import { DbDtoUser } from "../database/dto";

export class RepoUser {
	private dbUser: DbUser;

	constructor({ dbUser }: RepoUserConstructor) {
		this.dbUser = dbUser;
	}

	async getUserByIds({ ids }: GetUserByIdsInput): Promise<DbDtoUser[]> {
		const users = await this.dbUser.getUserByIds({ ids });
		return users;
	}

	async getUserById({
		id
	}: GetUserByIdInput): Promise<DbDtoUser | undefined> {
		const user = await this.dbUser.getUserById({ id });
		return user;
	}

	async getUserByEmail({
		email
	}: GetUserByEmailInput): Promise<DbDtoUser | undefined> {
		const user = await this.dbUser.getUserByEmail({ email });
		return user;
	}

	async getUserByUsername({
		username
	}: GetUserByUsernameInput): Promise<DbDtoUser | undefined> {
		const user = await this.dbUser.getUserByUsername({ username });
		return user;
	}

	async createUser(input: CreateUserInput): Promise<string> {
		const userId = await this.dbUser.createUser(input);
		return userId;
	}

	async updateUser(input: UpdateUserInput): Promise<void> {
		await this.dbUser.updateUser(input);
	}

	async isUserExist(input: IsUserExistInput) {
		const isExist = await this.dbUser.isUserExist(input);
		return isExist;
	}

	async followUser(input: FollowUserInput): Promise<void> {
		await this.dbUser.followUser(input);
	}

	async unfollowUser(input: UnfollowUserInput): Promise<void> {
		await this.dbUser.unfollowUser(input);
	}

	async isFollowing({
		followerId,
		followingId
	}: IsFollowingInput): Promise<boolean> {
		const isFollowing = await this.dbUser.isFollowing({
			followerId,
			followingId
		});
		return isFollowing;
	}

	async banUserById({ id }: BanUserByIdInput): Promise<void> {
		await this.dbUser.banUserById({ id });
	}

	async hiddenUserContent({ userId }: HiddenUserContentInput) {
		await this.dbUser.hiddenUserContent({ userId });
	}

	async getIsUserFollowingByUserIds({
		followerId,
		followingIds
	}: GetIsUsersFollowingByUserIdsInput): Promise<GetIsUsersFollowingByUserIdsOutput> {
		const isUsersFollowing = await this.dbUser.getIsUsersFollowingByUserId({
			followerId,
			followingIds
		});
		return isUsersFollowing;
	}
}

interface RepoUserConstructor {
	dbUser: DbUser;
}

export {
	type GetUserByIdInput,
	type GetUserByEmailInput,
	type FollowUserInput,
	type UnfollowUserInput,
	type IsFollowingInput,
	type BanUserByIdInput,
	type GetUserByUsernameInput,
	type GetUserByIdsInput,
	type GetIsUsersFollowingByUserIdsInput,
	type GetIsUsersFollowingByUserIdsOutput
} from "../database/DbUser";
