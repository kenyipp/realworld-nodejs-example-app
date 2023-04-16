import {
	PasswordHandler,
	type EncryptPasswordInput,
	type ComparePasswordInput
} from "./implementation/PasswordHandler";

export class AuthService {

	private passwordHandler: PasswordHandler;

	constructor() {
		this.passwordHandler = new PasswordHandler();
	}

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
		return this.passwordHandler.encryptPassword({ password });
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
	comparePassword({ password, encryptedPassword }: ComparePasswordInput) {
		this.passwordHandler.comparePassword({ password, encryptedPassword });
	}

}
