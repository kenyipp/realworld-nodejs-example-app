import { expect } from "chai";

import { Factory } from "../../Factory";
import {
	PasswordNotMatchError,
	PasswordRequirementsNotMetError
} from "../../service/auth/error";

describe("Auth - Password", () => {
	it("should throw an error if the password's length is less than 6", () => {
		try {
			authService.encryptPassword({ password: "abc12" });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(PasswordRequirementsNotMetError);
			if (error instanceof PasswordRequirementsNotMetError) {
				expect(error.details).have.lengthOf(1);
			}
		}
	});

	it("should throw an error if the password doesn't contain at least one digit or letter", () => {
		try {
			authService.encryptPassword({ password: "abcdef" });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(PasswordRequirementsNotMetError);
			if (error instanceof PasswordRequirementsNotMetError) {
				expect(error.details).have.lengthOf(1);
			}
		}
	});

	it("should throw an error if the length of the password is less than 6 characters and it doesn't contain at least one digit or letter", () => {
		try {
			authService.encryptPassword({ password: "abcde" });
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(PasswordRequirementsNotMetError);
			if (error instanceof PasswordRequirementsNotMetError) {
				expect(error.details).have.lengthOf(2);
			}
		}
	});

	it("should be able to encrypt a password securely", () => {
		const hash = authService.encryptPassword({ password: "123abc" });
		expect(hash).is.not.null;
	});

	it("should be able to encrypt and then verify a password", () => {
		const password = "123abc";
		const hash = authService.encryptPassword({ password });
		expect(hash).is.not.null;
		authService.comparePassword({ password, encryptedPassword: hash });
	});

	it("should throw an error if the password is incorrect", () => {
		const password = "123abc";
		const hash = authService.encryptPassword({ password });
		expect(hash).is.not.null;
		try {
			authService.comparePassword({ password, encryptedPassword: hash });
		} catch (error) {
			expect(error).instanceOf(PasswordNotMatchError);
		}
	});
});

const factory = new Factory();
const authService = factory.newAuthService();
