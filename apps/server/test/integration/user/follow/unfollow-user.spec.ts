import { expect } from "chai";
import supertest from "supertest";

import { Factory, dangerouslyResetDb } from "@conduit/core";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("User - Following", () => {
	it("should be able to unfollow a user", async () => {
		const { userB, accessToken } = await setup();
		const response = await request
			.delete(
				ServerPath.UnfollowUser.replace(":username", userB.username)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.profile).is.not.null;
		const { profile } = response.body;
		expect(profile.username).equals(userB.username);
		expect(profile.email).equals(userB.email);
		expect(profile.bio).equals(userB.bio);
		expect(profile.image).equals(userB.image);
		expect(profile.following).to.be.false;
	});

	it("should return a status code of 401 - Unauthorized if the client does not provide auth headers", async () => {
		const { userB } = await setup();
		const response = await request
			.delete(
				ServerPath.UnfollowUser.replace(":username", userB.username)
			)
			.send();
		expect(response.status).equals(401);
	});

	it("should return a status code of 403 - Forbidden if the user has been banned", async () => {
		const { userService, userA, userB, accessToken } = await setup();
		await userService.banUserById({ id: userA.id });
		const response = await request
			.delete(
				ServerPath.UnfollowUser.replace(":username", userB.username)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(403);
	});

	it("should return a status code of 400 - Bad Request if the user does not follow the targeted user", async () => {
		const { userService, accessToken } = await setup();
		const userC = await userService.createUser(getCreateUserInput({}));
		const response = await request
			.delete(
				ServerPath.UnfollowUser.replace(":username", userC.username)
			)
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(400);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const userA = await userService.createUser(getCreateUserInput({}));
	const userB = await userService.createUser(getCreateUserInput({}));
	await userService.followUser({
		followerId: userA.id,
		followingId: userB.id
	});
	const { accessToken } = signJsonWebToken({ dbDtoUser: userA });
	return {
		userService,
		userA,
		userB,
		accessToken
	};
};
