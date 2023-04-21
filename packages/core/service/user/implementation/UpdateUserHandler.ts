import { DbDtoUser } from "../../../database/dto";
import { type RepoUser } from "../../../repository/RepoUser";
import { type AuthService } from "../../auth/AuthService";
import { UserExistError, UserNotFoundError } from "../error";

export class UpdateUserHandler {
	private authService: AuthService;
	private repoUser: RepoUser;

	constructor({ authService, repoUser }: UpdateUserHandlerConstructor) {
		this.authService = authService;
		this.repoUser = repoUser;
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
	 *
	 * @throws {UserNotFoundError} - If the user with the given ID does not exist in the database.
	 * @throws {UserExistError} - If the provided email or username is already registered.
	 * @throws {Error} - If an error occurs while updating the user.
	 *
	 */
	async execute({
		id,
		email,
		username,
		password,
		image,
		bio
	}: UpdateUserInput): Promise<DbDtoUser> {
		let user = await this.repoUser.getUserById({ id });
		if (!user) {
			throw new UserNotFoundError();
		}
		await this.validateUserExist({ user, email, username });
		const hash = password
			? this.authService.encryptPassword({ password })
			: undefined;
		await this.repoUser.updateUser({
			id,
			email,
			username,
			hash,
			image,
			bio
		});
		user = await this.repoUser.getUserById({ id });
		return user;
	}

	private async validateUserExist({
		user,
		email,
		username
	}: ValidateUserExistInput) {
		const details: string[] = [];
		if (email && user.email !== email) {
			const isEmailExist = await this.repoUser.isUserExist({ email });
			if (isEmailExist) {
				details.push("email");
			}
		}
		if (username && user.username !== username) {
			const isUsernameExist = await this.repoUser.isUserExist({
				username
			});
			if (isUsernameExist) {
				details.push("username");
			}
		}
		if (details.length > 0) {
			throw new UserExistError({ details });
		}
	}
}

export interface UpdateUserHandlerConstructor {
	authService: AuthService;
	repoUser: RepoUser;
}

export interface UpdateUserInput {
	id: string;
	email?: string;
	username?: string;
	password?: string;
	image?: string;
	bio?: string;
}

export interface ValidateUserExistInput {
	user: DbDtoUser;
	email?: string;
	username?: string;
}
