import { expect } from "chai";

import { Factory } from "../../Factory";
import { dangerouslyResetDb } from "../../knex";
import { UserNotFoundError } from "../../service/user/error";
import { getCreateUserInput } from "../mockData";

describe("User - Ban User", () => {
	it("should be able to ban an user", async () => {
		const { userService, user } = await setup();
		await userService.banUserById({ id: user.id });
	});

	it("should throw an error if the banned user does not exist", async () => {
		const { userService } = await setup();
		try {
			await userService.banUserById({ id: "HELLO_KITTY" });
		} catch (error) {
			expect(error).instanceOf(UserNotFoundError);
		}
	});

	it("should throw an error if the banned user has been banned", async () => {
		const { userService, user } = await setup();
		await userService.banUserById({ id: user.id });
		try {
			await userService.banUserById({ id: user.id });
		} catch (error) {
			expect(error).instanceOf(UserNotFoundError);
		}
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const user = await userService.createUser(getCreateUserInput({}));
	return {
		userService,
		user
	};
};
