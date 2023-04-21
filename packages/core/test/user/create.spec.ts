import { expect } from "chai";

import { UserStatus } from "@conduit/types";

import { Factory } from "../../Factory";
import { dangerouslyResetDb } from "../../knex";
import { UserExistError } from "../../service/user/error";
import { type CreateUserInput } from "../../service/user/implementation";

describe("User - Create User", () => {
	it("should be able to create an user", async () => {
		const user = await userService.createUser(createUserInput);
		expect(user).is.not.null;
		expect(user.username).equals(createUserInput.username);
		expect(user.email).equals(createUserInput.email);
		expect(user.statusId).equals(UserStatus.Normal);
		expect(user.bio).is.null;
		expect(user.image).is.null;
	});

	it("should throw an error if the username is already taken", async () => {
		await userService.createUser(createUserInput);
		try {
			await userService.createUser({
				username: "test",
				password: "abc123",
				email: "test2@test.com"
			});
		} catch (error) {
			expect(error).instanceOf(UserExistError);
		}
	});

	it("should throw an error if the email has already been used", async () => {
		await userService.createUser(createUserInput);
		try {
			await userService.createUser({
				username: "test2",
				password: "abc123",
				email: "test@test.com"
			});
		} catch (error) {
			expect(error).instanceOf(UserExistError);
		}
	});

	beforeEach(() => dangerouslyResetDb());
});

const factory = new Factory();
const userService = factory.newUserService();

const createUserInput: CreateUserInput = {
	username: "test",
	password: "abc123",
	email: "test@test.com"
};
