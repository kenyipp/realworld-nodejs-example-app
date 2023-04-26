import { expect } from "chai";
import supertest, { Response } from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("User - Update", () => {
	it("should be able to update the user account", async () => {
		const { user, accessToken } = await setup();
		const response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				user: {
					username: "Ken",
					password: null
				}
			});
		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.user).is.not.null;
		expect(response.body.user.email).equals(user.email);
		expect(response.body.user.token).is.not.null;
		expect(response.body.user.username).equals("Ken");
		expect(response.body.user.image).equals(user.image);
		expect(response.body.user.bio).equals(user.bio);
	});

	it("should be able to update the user password", async () => {
		const { user, accessToken } = await setup();
		let response: Response | null = null;
		response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				user: {
					username: "ken",
					password: "abc94340634"
				}
			});
		expect(response.status).equals(200);
		response = await request.post(ServerPath.Login).send({
			user: {
				email: user.email,
				password: "abc94340634"
			}
		});
		expect(response.status).equals(200);
	});

	it("should invalidate old access token after user updates their password", async () => {
		const { accessToken } = await setup();
		let response: Response | null = null;
		response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				user: {
					username: "ken",
					password: "abc94340634"
				}
			});
		expect(response.status).equals(200);
		response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				user: {
					username: "ken",
					password: "abc94340634"
				}
			});
		expect(response.status).equals(401);
	});

	it("should return a status code of 422 - Unprocessable Entity if the client provides invalid data type", async () => {
		const { accessToken } = await setup();
		const response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({
				user: {
					username: "ken",
					email: "123"
				}
			});
		expect(response.status).equals(422);
	});

	it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide the required data fields", async () => {
		const { accessToken } = await setup();
		const response = await request
			.put(ServerPath.UpdateUser)
			.set("Authorization", `Bearer ${accessToken}`)
			.send({ user: {} });
		expect(response.status).equals(422);
	});

	it("should return a status code of 401 - Unauthorized if the client doesn't provide auth headers", async () => {
		await setup();
		const response = await request
			.put(ServerPath.UpdateUser)
			.send({ user: { username: "ken" } });
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
