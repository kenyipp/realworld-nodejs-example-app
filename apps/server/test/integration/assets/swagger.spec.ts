import supertest from "supertest";
import { expect } from "chai";
import { ServerPath } from "@conduit/types";
import { app } from "../../../app";

const request = supertest(app);

describe("Swagger", () => {
	it("should be able to retrieve the swagger.json", async () => {
		const response = await request
			.get(ServerPath.GetSwaggerJson)
			.send();
		expect(response.status).equals(200);
		expect(response.body).instanceOf(Object);
		expect(response.body.openapi).equals("3.0.1");
	});
});
