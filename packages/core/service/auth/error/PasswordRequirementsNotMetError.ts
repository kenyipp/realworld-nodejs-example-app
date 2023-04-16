import { BaseError } from "@conduit/utils";
import { ErrorCodes } from "../AuthConstants";

export class PasswordRequirementsNotMetError extends BaseError {

	constructor({ details }: PasswordRequirementsNotMetErrorConstructor) {
		super({
			code: ErrorCodes.PasswordRequirementsNotMetError,
			message: "Password requirements not met. Your password must be at least 6 characters long and contain at least one letter and one digit.",
			details
		});
	}

}

interface PasswordRequirementsNotMetErrorConstructor {
	details?: string[];
}
