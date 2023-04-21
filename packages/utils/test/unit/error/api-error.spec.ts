import { expect } from "chai";

import { APIError, APIErrorBadRequest } from "../../../error/APIError";
import { BaseError } from "../../../error/BaseError";

describe("Error module", () => {
	it("should able to assert the error", () => {
		try {
			BaseError.assert({
				condition: false,
				code: TESTING_ERROR_CODE,
				message: TESTING_ERROR_MESSAGE
			});
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(BaseError);
			if (error instanceof BaseError) {
				expect(error.code).equals(TESTING_ERROR_CODE);
				expect(error.message).equals(TESTING_ERROR_MESSAGE);
			}
		}
	});

	it("should able to throw an API error with correct HTTP code", () => {
		try {
			APIErrorBadRequest.assert({
				condition: false,
				message: TESTING_ERROR_MESSAGE,
				cause: new BaseError({ message: TESTING_ERROR_MESSAGE })
			});
			expect.fail();
		} catch (error) {
			expect(error).instanceOf(APIError);
			if (error instanceof APIError) {
				expect(error.code).equals(400);
				expect(error.cause).instanceOf(BaseError);
				expect(error.message).equals(TESTING_ERROR_MESSAGE);
			}
		}
	});
});

const TESTING_ERROR_CODE = "<testing error code>";
const TESTING_ERROR_MESSAGE = "<testing error message>";
