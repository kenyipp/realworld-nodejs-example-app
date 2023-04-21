import { isNil } from "lodash";

import {
	type BanUserByIdInput,
	type RepoUser
} from "../../../repository/RepoUser";
import { UserNotFoundError } from "../error";

export class BanUserHandler {
	private repoUser: RepoUser;

	constructor({ repoUser }: BanUserHandlerConstructor) {
		this.repoUser = repoUser;
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
	async execute({ id }: BanUserByIdInput): Promise<void> {
		await this.validateUser({ id });
		await this.repoUser.banUserById({ id });
		// Mark all the contents created by the user as deleted.
		await this.repoUser.hiddenUserContent({ userId: id });
	}

	/**
	 *
	 * Validates that a user with the given ID exists.
	 *
	 * @private
	 * @async
	 * @function validateUser
	 *
	 * @param {Object} params - An object containing the ID of the user to validate.
	 * @param {string} params.id - The ID of the user to validate.
	 *
	 * @returns {Promise<void>} A Promise that resolves with no value if the user exists, or rejects with an error if it does not.
	 * @throws {UserNotFoundError} If the user with the given ID does not exist.
	 *
	 */
	private async validateUser({ id }: BanUserByIdInput): Promise<void> {
		const user = await this.repoUser.getUserById({ id });
		if (isNil(user)) {
			throw new UserNotFoundError();
		}
	}
}

interface BanUserHandlerConstructor {
	repoUser: RepoUser;
}

export { BanUserByIdInput } from "../../../repository/RepoUser";
