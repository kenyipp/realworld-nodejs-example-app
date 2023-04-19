import { compareSync, hashSync, genSaltSync } from "bcryptjs";
import { appConfig } from "@conduit/config";
import {
	PasswordNotMatchError,
	PasswordRequirementsNotMetError
} from "../error";

export class PasswordHandler {

	/**
	 *
	 * Encrypts the given password using bcrypt algorithm and returns the encrypted password.
	 *
	 * @param {Object} input - The input object for encrypting the password.
	 * @param {string} input.password - The password to be encrypted.
	 *
	 * @throws {PasswordRequirementsNotMetError} If the password does not meet the requirements.
	 * @returns {string} The encrypted password.
	 *
	 */
	encryptPassword({ password }: EncryptPasswordInput): string {
		this.validatePassword({ password });
		const salt = genSaltSync(appConfig.auth.saltRounds);
		const hash = hashSync(password, salt);
		return hash;
	}

	/**
	 *
	 * Compares a password with the encrypted password and throws an error if they do not match.
	 *
	 * @param {Object} input - The input object containing the password and encrypted password to compare.
	 * @param {string} input.password - The password to compare.
	 * @param {string} input.encryptedPassword - The encrypted password to compare.
	 *
	 * @throws {PasswordNotMatchError} If the password does not match the encrypted password.
	 *
	 */
	comparePassword({ password, encryptedPassword }: ComparePasswordInput): void {
		const matched = compareSync(password, encryptedPassword);
		if (!matched) {
			throw new PasswordNotMatchError();
		}
	}

	/**
	 *
	 * Validates a password to ensure it meets the specified requirements.
	 *
	 * @param {Object} input - The input object containing the password to validate.
	 * @param {string} input.password - The password to validate.
	 *
	 * @throws {PasswordRequirementsNotMetError} If the password does not meet the requirements.
	 * @returns {void}
	 *
	 */
	private validatePassword({ password }: ValidatePasswordInput): void {
		const details: string[] = [];
		if (password.length < 6) {
			details.push("The password must be at least 6 characters long");
		}
		// Regular expression to match passwords with at least one letter and one digit
		const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
		if (!passwordRegex.test(password)) {
			details.push("The password must contain at least one letter and one digit");
		}
		if (details.length > 0) {
			throw new PasswordRequirementsNotMetError({ details });
		}
	}

}

export interface EncryptPasswordInput {
	password: string;
}

export interface ComparePasswordInput {
	password: string;
	encryptedPassword: string;
}

export interface ValidatePasswordInput {
	password: string;
}
