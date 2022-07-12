"use strict";

const _ = require("lodash");
const Chance = require("chance");
const supertest = require("supertest");

const app = require("../app");

const request = supertest(app);
const chance = new Chance();

const user = {
	email: chance.email(),
	username: chance.name(),
	password: chance.string()
};

describe("User Registration", () => {
	it("should fail the request body validations if no payload passed", (done) => {
		request
			.post("/api/users")
			.expect(422)
			.end(done);
	});

	it("should success to register", async () => {
		const response = await request
			.post("/api/users")
			.send({ user })
			.expect(200);

		expect(response.body).toHaveProperty("user");
		expect(response.body.user.email).toBe(user.email);
		expect(response.body.user.username).toBe(user.username);
		expect(response.body.user).toHaveProperty("bio");
		expect(response.body.user).toHaveProperty("image");
		expect(response.body.user).toHaveProperty("token");

		user.token = response.body.user.token;
	});

	it("should fail to register if the email has been registered before", (done) => {
		request
			.post("/api/users")
			.send({ user: _.omit(user, ["token"]) })
			.expect(400)
			.end(done);
	});
});

describe("User Login", () => {
	it("should fail the request body validations if no payload passed", (done) => {
		request
			.post("/api/users/login")
			.expect(422)
			.end(done);
	});

	it("should fail to login if wrong password has passed", (done) => {
		request
			.post("/api/users/login")
			.send({
				user: {
					email: user.email,
					password: chance.string()
				}
			})
			.expect(401)
			.end(done);
	});

	it("should success to login", async () => {
		const response = await request
			.post("/api/users/login")
			.send({ user: _.pick(user, ["email", "password"]) })
			.expect(200);

		expect(response.body).toHaveProperty("user");
		expect(response.body.user.email).toBe(user.email);
		expect(response.body.user.username).toBe(user.username);
		expect(response.body.user).toHaveProperty("bio");
		expect(response.body.user).toHaveProperty("image");
		expect(response.body.user).toHaveProperty("token");
	});
});

describe("User Get", () => {
	it("should fail to get the user document if user don't pass the access token", (done) => {
		request
			.get("/api/user")
			.expect(403)
			.end(done);
	});

	it("should success to get the user document", async () => {
		const response = await request
			.get("/api/user")
			.set("Authorization", `Bearer ${user.token}`)
			.expect(200);

		expect(response.body).toHaveProperty("user");
		expect(response.body.user.email).toBe(user.email);
		expect(response.body.user.username).toBe(user.username);
		expect(response.body.user).toHaveProperty("bio");
		expect(response.body.user).toHaveProperty("image");
		expect(response.body.user).toHaveProperty("token");
	});
});

describe("User Update", () => {
	it("should fail to update the user document if user don't pass the access token", (done) => {
		request
			.put("/api/user")
			.expect(403)
			.end(done);
	});

	it("should success to update the user", async () => {
		const newEmail = chance.email();

		const response = await request
			.put("/api/user")
			.set("Authorization", `Bearer ${user.token}`)
			.send({ user: { email: newEmail } })
			.expect(200);

		expect(response.body).toHaveProperty("user");
		expect(response.body.user.email).toBe(newEmail);
		expect(response.body.user.username).toBe(user.username);
		expect(response.body.user).toHaveProperty("bio");
		expect(response.body.user).toHaveProperty("image");
		expect(response.body.user).toHaveProperty("token");
	});
});
