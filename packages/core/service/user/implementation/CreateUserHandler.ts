import { DbDtoUser } from "../../../database/dto";
import { type RepoUser } from "../../../repository/RepoUser";
import { type AuthService } from "../../auth/AuthService";
import { UserExistError } from "../error";

export class CreateUserHandler {
	private authService: AuthService;
	private repoUser: RepoUser;

	constructor({ authService, repoUser }: CreateUserHandlerConstructor) {
		this.authService = authService;
		this.repoUser = repoUser;
	}

	/**
	 *
	 * Executes a command to create a new user in the database.
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
	async execute({
		email,
		username,
		password,
		image,
		bio
	}: CreateUserInput): Promise<DbDtoUser> {
		const encrypted = this.authService.encryptPassword({ password });
		const isUserExist = await this.repoUser.isUserExist({
			email,
			username
		});
		if (isUserExist) {
			throw new UserExistError({});
		}
		const userId = await this.repoUser.createUser({
			email,
			username,
			hash: encrypted,
			image,
			bio
		});
		const user = await this.repoUser.getUserById({ id: userId });
		return user;
	}
}

export interface CreateUserHandlerConstructor {
	authService: AuthService;
	repoUser: RepoUser;
}

export interface CreateUserInput {
	email: string;
	username: string;
	password: string;
	image?: string;
	bio?: string;
}
