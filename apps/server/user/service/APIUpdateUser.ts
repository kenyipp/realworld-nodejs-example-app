import { isNil } from "lodash";

import { DbDtoUser } from "@conduit/core/database/dto";
import { UserService } from "@conduit/core/service";
import { APIErrorUnprocessableEntity } from "@conduit/utils";

import { ErrorCodes } from "../../constants";
import { DtoInputUpdateUser, DtoUser } from "../dto";

export class APIUpdateUser {
	private userService: UserService;

	constructor({ userService }: APIUpdateUserConstructor) {
		this.userService = userService;
	}

	/**
	 *
	 * Executes the API request to update a user's information.
	 *
	 * @param {APIUpdateUserInput} - The input object containing updates, user and userId.
	 *
	 * @returns {Promise<UpdateUserOutput>} - A Promise that resolves to an object containing the updated user.
	 *
	 */
	async execute({
		updates,
		user
	}: APIUpdateUserInput): Promise<UpdateUserOutput> {
		this.validateRequest({ updates, user });
		await this.userService.updateUserById({ id: user.id, ...updates });
		const updatedUser = await this.getUpdatedUser({ userId: user.id });
		return { user: updatedUser };
	}

	/**
	 *
	 * Retrieves the updated user with a new token.
	 *
	 * @param {Object} - An object containing the userId as a string.
	 *
	 * @returns {Promise<DtoUser>} - A Promise that resolves to a DTO object containing the updated user and token.
	 *
	 */
	private async getUpdatedUser({
		userId
	}: {
		userId: string;
	}): Promise<DtoUser> {
		const updatedUser = await this.userService.getUserById({ id: userId });
		const dtoUser = new DtoUser({ dbDtoUser: updatedUser });
		return dtoUser;
	}

	/**
	 *
	 * Validates the request to update a user's information.
	 *
	 * @param {APIUpdateUserInput} - The input object containing updates, user and userId.
	 *
	 * @throws {APIErrorForbidden} - If the user is not authorized to perform this action.
	 * @throws {APIErrorUnprocessableEntity} - If no updates were provided.
	 *
	 */
	private validateRequest({ updates }: APIUpdateUserInput) {
		APIErrorUnprocessableEntity.assert({
			condition: ["bio", "email", "image", "password", "username"].some(
				(key) => !isNil(updates[key])
			),
			errorCode: ErrorCodes.UnprocessableContent,
			message:
				"No updates were provided. Please include at least one field to update."
		});
	}
}

interface APIUpdateUserConstructor {
	userService: UserService;
}

interface APIUpdateUserInput {
	// The input data for updating the user
	updates: DtoInputUpdateUser;
	// The user object obtained from the authentication middleware
	user: DbDtoUser;
}

interface UpdateUserOutput {
	user: DtoUser;
}
