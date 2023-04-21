import { expect } from "chai";
import supertest, { Response } from "supertest";

import { dangerouslyResetDb } from "@conduit/core";
import { ServerPath } from "@conduit/types";

import { app } from "../../../../app";

const request = supertest(app);

describe("User - Registration", () => {
	it("should be able to register an user account", async () => {
		const response = await request.post(ServerPath.Registration).send({
			user: {
				username: "Jacob",
				email: "jake@jake.jake",
				password: "jake123"
			}
		});
		expect(response.status).equals(200);
		expect(response.body.user).is.not.null;
		expect(response.body.user.email).is.not.null;
		expect(response.body.user.username).is.not.null;
		expect(response.body.user.bio).is.not.undefined;
		expect(response.body.user.image).is.not.undefined;
		expect(response.body.user.token).is.not.null;
	});

	it("should return a status code of 422 - Unprocessable Entity if the client doesn't provide the required data fields", async () => {
		const response = await request.post(ServerPath.Registration).send({
			user: {
				username: "Jacob"
			}
		});
		expect(response.status).equals(422);
	});

	it("should return 409 - Conflict if the username or email has been used before", async () => {
		let response: Response = null;
		response = await request.post(ServerPath.Registration).send({
			user: {
				username: "Jacob",
				email: "jake@jake.jake",
				password: "jake123"
			}
		});
		expect(response.status).equals(200);
		response = await request.post(ServerPath.Registration).send({
			user: {
				username: "Jacob",
				email: "jake@jake.jake",
				password: "jake123"
			}
		});
		expect(response.status).equals(409);
	});

	it("should return 400 - Bad Request if the password doesn't match the policy", async () => {
		let response: Response = null;
		response = await request.post(ServerPath.Registration).send({
			user: {
				username: "Jacob",
				email: "jake@jake.jake",
				password: "abcdef"
			}
		});
		expect(response.status).equals(400);
	});

	beforeEach(() => dangerouslyResetDb());
});
