import supertest from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("User - Get Current User", () => {
	it("should be able to get the current user", async () => {
		const {
			user,
			accessToken
		} = await setup();
		const response = await request
			.get(ServerPath.GetCurrentUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.user).is.not.null;
		expect(response.body.user.email).equals(user.email);
		expect(response.body.user.token).is.not.null;
		expect(response.body.user.username).equals(user.username);
	});

	it("should return a status code of 403 - Forbidden if the user has been banned", async () => {
		const {
			user,
			userService,
			accessToken
		} = await setup();
		await userService.banUserById({ id: user.id });
		const response = await request
			.get(ServerPath.GetCurrentUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(403);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		const response = await request
			.get(ServerPath.GetCurrentUser)
			.send();
		expect(response.status).equals(401);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const input = getCreateUserInput({});
	const user = await userService.createUser(input);
	const { accessToken } = signJsonWebToken({ dbDtoUser: user });
	return {
		user,
		userService,
		accessToken
	};
};
