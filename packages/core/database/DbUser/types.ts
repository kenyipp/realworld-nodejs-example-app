import { DbDtoUser } from "../dto";

export interface CreateUserInput {
	username: string;
	email: string;
	bio?: string;
	image?: string;
	hash: string;
}

export type CreateUserOutput = Promise<string>;

export interface UpdateUserInput {
	id: string;
	email?: string;
	username?: string;
	hash?: string;
	image?: string;
	bio?: string;
}

export type UpdateUserOutput = Promise<void>;

export interface IsUserExistInput {
	username?: string;
	email?: string;
}

export type IsUserExistOutput = Promise<boolean>;

export interface GetUserByIdsInput {
	ids: string[];
}

export type GetUserByIdsOutput = Promise<DbDtoUser[]>;

export interface GetUserByIdInput {
	id: string;
}

export type GetUserByIdOutput = Promise<DbDtoUser | undefined>;

export interface GetUserByEmailInput {
	email: string;
}

export type GetUserByEmailOutput = Promise<DbDtoUser | undefined>;

export interface GetUserByUsernameInput {
	username: string;
}

export type GetUserByUsernameOutput = Promise<DbDtoUser | undefined>;

export interface FollowUserInput {
	followerId: string;
	followingId: string;
}

export type FollowUserOutput = Promise<void>;

export interface UnfollowUserInput {
	followerId: string;
	followingId: string;
}

export type UnfollowUserOutput = Promise<void>;

export interface IsFollowingInput {
	followerId: string;
	followingId: string;
}

export type IsFollowingOutput = Promise<boolean>;

export interface BanUserByIdInput {
	id: string;
}

export type BanUserByIdOutput = Promise<void>;

export interface GetIsUsersFollowingByUserIdsInput {
	followerId: string;
	followingIds: string[];
}

export type GetIsUsersFollowingByUserIdsOutput = Promise<{
	[userId: string]: boolean;
}>;

export interface HiddenUserContentInput {
	userId: string;
}

export type HiddenUserContentOutput = Promise<void>;
