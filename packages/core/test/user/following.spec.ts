import { expect } from "chai";

import { Factory } from "../../Factory";
import { dangerouslyResetDb } from "../../knex";
import { InvalidFollowError } from "../../service/user/error";
import { getCreateUserInput } from "../mockData";

describe("User - following", () => {
	describe("Follow an User", () => {
		it("should be able to follow an user", async () => {
			const { userService, userA, userB } = await setup();
			await userService.followUser({
				followerId: userA.id,
				followingId: userB.id
			});
			const isFollowing = await userService.isFollowing({
				followerId: userA.id,
				followingId: userB.id
			});
			expect(isFollowing).to.be.true;
		});

		it("should throw an error if the user is already following the targeted user", async () => {
			const { userService, userA, userB } = await setup();
			await userService.followUser({
				followerId: userA.id,
				followingId: userB.id
			});
			try {
				await userService.followUser({
					followerId: userA.id,
					followingId: userB.id
				});
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(InvalidFollowError);
			}
		});

		it("should throw an error if the user is trying to follow themselves", async () => {
			const { userService, userA } = await setup();
			try {
				await userService.followUser({
					followerId: userA.id,
					followingId: userA.id
				});
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(InvalidFollowError);
			}
		});
	});

	describe("Unfollow an User", () => {
		it("should be able to unfollow an user", async () => {
			const { userService, userA, userB } = await setup();
			let isFollowing = false;
			await userService.followUser({
				followerId: userA.id,
				followingId: userB.id
			});
			isFollowing = await userService.isFollowing({
				followerId: userA.id,
				followingId: userB.id
			});
			expect(isFollowing).to.be.true;
			await userService.unfollowUser({
				followerId: userA.id,
				followingId: userB.id
			});
			isFollowing = await userService.isFollowing({
				followerId: userA.id,
				followingId: userB.id
			});
			expect(isFollowing).to.be.false;
		});

		it("should throw an error if the user is trying to unfollow a user that they are not currently following", async () => {
			const { userService, userA, userB } = await setup();
			try {
				await userService.unfollowUser({
					followerId: userA.id,
					followingId: userB.id
				});
				expect.fail();
			} catch (error) {
				expect(error).instanceOf(InvalidFollowError);
			}
		});
	});

	beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
	const factory = new Factory();
	const userService = factory.newUserService();
	const userA = await userService.createUser(getCreateUserInput({}));
	const userB = await userService.createUser(getCreateUserInput({}));
	return {
		userService,
		userA,
		userB
	};
};
