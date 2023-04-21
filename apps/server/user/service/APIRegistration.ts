import { UserService } from "@conduit/core/service";
import { PasswordRequirementsNotMetError } from "@conduit/core/service/auth/error";
import { UserExistError } from "@conduit/core/service/user/error";
import { APIErrorBadRequest, APIErrorConflict } from "@conduit/utils";

import { DtoInputRegistration, DtoUser } from "../dto";

export class APIRegistration {
	private userService: UserService;

	constructor({ userService }: APIRegistrationConstructor) {
		this.userService = userService;
	}

	async execute({
		input
	}: APIRegistrationInput): Promise<APIRegistrationOutput> {
		try {
			const dbDtoUser = await this.userService.createUser(input);
			const user = new DtoUser({ dbDtoUser });
			const response = { user };
			return response;
		} catch (error) {
			if (error instanceof PasswordRequirementsNotMetError) {
				throw new APIErrorBadRequest({
					message:
						"Password requirements not met. Your password must be at least 6 characters long and contain at least one letter and one digit.",
					cause: error
				});
			}
			if (error instanceof UserExistError) {
				throw new APIErrorConflict({
					message:
						"The provided email or username is already registered. Please use a different email or username.",
					cause: error
				});
			}
			throw error;
		}
	}
}

interface APIRegistrationConstructor {
	userService: UserService;
}

interface APIRegistrationInput {
	input: DtoInputRegistration;
}

interface APIRegistrationOutput {
	user: DtoUser;
}
