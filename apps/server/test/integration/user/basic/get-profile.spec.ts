import supertest from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { getCreateUserInput } from "@conduit/core/test/mockData";
import { app } from "../../../../app";
import { signJsonWebToken } from "../../../../utils";

const factory = new Factory();
const request = supertest(app);

describe("User - Get Profile", () => {
	it("should be able to get the user profile", async () => {
		const {
			userB,
			accessToken
		} = await setup();
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", userB.username))
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
	});

	it("should return a status code of 404 - Not Found if the targeted user does not exist", async () => {
		const { accessToken } = await setup();
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", "UN_EXIST_USERNAME"))
			.set("Authorization", `Bearer ${accessToken}`)
			.send();
		expect(response.status).equals(404);
	});

	it("should return a profile with the following attribute with a value of true if the requested user is following the targeted user", async () => {
		const {
			userService,
			userA,
			userB,
			accessToken
		} = await setup();
		await userService.followUser({ followerId: userA.id, followingId: userB.id });
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", userB.username))
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
		expect(profile.following).to.be.true;
	});

	it("should return a profile with the following attribute with a value of false if the requested user is not following the targeted user", async () => {
		const {
			userB,
			accessToken
		} = await setup();
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", userB.username))
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

	it("should return a profile with the following attribute with a value of false if the client does not provide a valid auth token", async () => {
		const { userB } = await setup();
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", userB.username))
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

	it("should return a status code of 401 - Unauthorized if the client provides an invalid auth header", async () => {
		const {
			userB,
			accessToken
		} = await setup();
		const response = await request
			.get(ServerPath.GetProfile.replace(":username", userB.username))
			.set("Authorization", `Bearer ${accessToken}+InvalidToken`)
			.send();
		expect(response.status).equals(401);
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const userService = factory.newUserService();
	const userA = await userService.createUser(getCreateUserInput({}));
	const userB = await userService.createUser(getCreateUserInput({}));
	const { accessToken } = signJsonWebToken({ dbDtoUser: userA });
	return {
		userService,
		userA,
		userB,
		accessToken
	};
};
