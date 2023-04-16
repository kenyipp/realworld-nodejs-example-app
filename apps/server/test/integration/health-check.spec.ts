import supertest from "supertest";
import { expect } from "chai";
import { ServerPath } from "@conduit/types";
import { app } from "../../app";

const request = supertest(app);

describe("Health Check", () => {
	it("should be capable of passing the health check", async () => {
		const response = await request.get(ServerPath.HealthCheck);
		expect(response.status).equals(200);
	});
});
