import { pick } from "lodash";
import supertest from "supertest";
import { expect } from "chai";
import { dangerouslyResetDb, Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { CreateUserInput } from "@conduit/core/service/user/implementation";
import { app } from "../../../../app";

const factory = new Factory();
const userService = factory.newUserService();

const user: CreateUserInput = {
	username: "Jacob",
	email: "jake@jake.jake",
	password: "jake123"
};

const request = supertest(app);

describe("User - Login", () => {
	it("should be able to login with a correct username and password", async () => {
		const response = await request
			.post(ServerPath.Login)
			.send({ user: pick(user, ["email", "password"]) });
		expect(response.status).equals(200);
		expect(response.body).is.not.null;
		expect(response.body.user).is.not.null;
		expect(response.body.user.email).equals(user.email);
		expect(response.body.user.token).is.not.null;
		expect(response.body.user.username).equals(user.username);
	});

	it("should throw an error if the password entered is incorrect", async () => {
		const response = await request
			.post(ServerPath.Login)
			.send({
				user: {
					email: user.email,
					password: "jake1234"
				}
			});
		expect(response.status).equals(401);
	});

	it("should throw an error if the user does not exist", async () => {
		const response = await request
			.post(ServerPath.Login)
			.send({
				user: {
					email: `${user.email}.jake`,
					password: user.password
				}
			});
		expect(response.status).equals(404);
	});

	it("should throw an error if the user has been banned", async () => {
		const dbUser = await userService.getUserByEmail({ email: user.email });
		await userService.banUserById({ id: dbUser.id });
		const response = await request
			.post(ServerPath.Login)
			.send({
				user: {
					email: user.email,
					password: user.password
				}
			});
		expect(response.status).equals(403);
	});

	before(async () => {
		await dangerouslyResetDb();
		await userService.createUser(user);
	});
});
