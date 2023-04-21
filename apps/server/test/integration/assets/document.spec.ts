import { expect } from "chai";
import supertest from "supertest";

import { ServerPath } from "@conduit/types";

import { app } from "../../../app";

const request = supertest(app);

describe("Document", () => {
	it("should be able to retrieve the API server document", async () => {
		const response = await request
			.get(ServerPath.Documentation)
			.expect("Content-Type", /html/)
			.send();
		expect(response.status).equals(200);
		expect(response.text).is.not.null;
	});
});
