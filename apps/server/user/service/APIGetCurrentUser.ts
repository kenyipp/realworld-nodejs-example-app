import { type DbDtoUser } from "@conduit/core/database/dto";
import { UserStatus } from "@conduit/types";
import { APIErrorForbidden } from "@conduit/utils";
import { DtoUser } from "../dto/DtoUser";

export class APIGetCurrentUser {

	/**
	 * Generates a JSON Web Token for the provided user,
	 * creates a new DtoUser instance with the user data and token, and returns it as part of a GetCurrentUserOutput object.
	 *
	 * @param {object} input - An object containing the user data required to generate the JSON Web Token.
	 * @param {object} input.dbDtoUser - The user data retrieved from the database.
	 *
	 * @returns {object} - An object containing the newly created DtoUser instance.
	 * @throws {Error} - If the JSON Web Token could not be generated.
	 *
	 */
	execute({ dbDtoUser }: GetCurrentUserInput): GetCurrentUserOutput {
		APIErrorForbidden.assert({
			condition: dbDtoUser.statusId !== UserStatus.Banned,
			message: "Sorry, your account has been banned. You can no longer access our services. If you think this is a mistake, please contact our support team. Thank you."
		});
		const dtoUser = new DtoUser({ dbDtoUser });
		return { user: dtoUser };
	}

}

interface GetCurrentUserOutput {
	user: DtoUser;
}

interface GetCurrentUserInput {
	dbDtoUser: DbDtoUser;
}
