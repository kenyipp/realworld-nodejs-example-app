import { expect } from "chai";
import { dangerouslyResetDb } from "../../knex";
import { Factory } from "../../Factory";
import {
	type CreateUserInput,
	type UpdateUserInput
} from "../../service/user/implementation";
import { UserExistError } from "../../service/user/error";

describe("User - Update User", () => {
	it("should be able to update the user", async () => {
		let { user } = await setup();
		const updateUserInput: UpdateUserInput = {
			id: user.id,
			email: "jake@jake.jake",
			bio: "I like to skateboard",
			image: "https://i.stack.imgur.com/xHWG8.jpg"
		};
		user = await userService.updateUserById(updateUserInput);
		expect(user.email).equals(updateUserInput.email);
		expect(user.bio).equals(updateUserInput.bio);
		expect(user.image).equals(updateUserInput.image);
	});

	it("should be able to update only the provided fields", async () => {
		const { user } = await setup();
		const updateUserInput: UpdateUserInput = {
			id: user.id,
			bio: "I like to skateboard"
		};
		const updatedUser = await userService.updateUserById(updateUserInput);
		expect(user.email).equals(updatedUser.email);
		expect(updatedUser.bio).equals(updateUserInput.bio);
	});

	it("should throw an error if user tries to update their email with an existing username", async () => {
		const { user } = await setup();
		const userB = await userService.createUser({
			username: "test2",
			password: "abc123",
			email: "test2@test.com"
		});
		const updateUserInput: UpdateUserInput = {
			id: userB.id,
			username: user.username
		};
		try {
			await userService.updateUserById(updateUserInput);
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(UserExistError);
			if (error instanceof UserExistError) {
				expect(error.details).has.lengthOf(1);
			}
		}
	});

	it("should throw an error if user tries to update their email with an existing email address", async () => {
		const { user } = await setup();
		const userB = await userService.createUser({
			username: "test2",
			password: "abc123",
			email: "test2@test.com"
		});
		const updateUserInput: UpdateUserInput = {
			id: userB.id,
			email: user.email
		};
		try {
			await userService.updateUserById(updateUserInput);
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(UserExistError);
			if (error instanceof UserExistError) {
				expect(error.details).has.lengthOf(1);
			}
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

const setup = async () => {
	const user = await userService.createUser(createUserInput);
	return { user };
};
