import { v4 as Uuid } from "uuid";
import {
	APIError,
	logger,
	APIErrorUnprocessableEntity,
	APIErrorInternalServerError
} from "@conduit/utils";
import {
	type Express,
	type ErrorRequestHandler
} from "express";
import { Environments } from "@conduit/types";

/**
 *
 * Sets up a global error handling middleware in an Express app using the error handler function.
 *
 * @param {Object} options - The options object.
 * @param {Express} options.app - The Express app instance.
 *
 * @returns {void}
 *
 */
export const configureGlobalExceptionHandler = ({ app }: { app: Express }): void => {
	app.use(handler);
};

/**
 *
 * Express error handling middleware that catches any unhandled errors and
 * returns an appropriate API error response.
 *
 * @param error - The error that was thrown by a previous middleware or route handler.
 * @param _req - The Express request object, unused in this function.
 * @param res - The Express response object.
 * @param _next - The Express next function, unused in this function.
 *
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handler: ErrorRequestHandler = (error, _req, res, _next): void => {
	if (process.env.NODE_ENV !== Environments.Testing) {
		// Log the error using the winston logger
		logger.error(error);
	}

	// Generate a unique error ID using UUID
	const errorId = Uuid();

	// If the error is a Joi validation error, format it as an API error
	if (error.isJoi) {
		logger.error(JSON.stringify(error.details, null, 4));
		error = new APIErrorUnprocessableEntity({
			message: error.details.map((item) => item.message).join("\n"),
			payload: error.details.map((item) => item.message)
		});
	}

	// If the error is not already an instance of APIError, format it as an internal server error
	if (!(error instanceof APIError)) {
		// eslint-disable-next-line no-console
		logger.error(error);
		error = new APIErrorInternalServerError({
			message: error?.message,
			cause: error
		});
	}

	if (error instanceof APIErrorInternalServerError && process.env.NODE_ENV === Environments.Testing) {
		logger.error(error);
	}

	// Set the HTTP status code and return the error as a JSON response
	res.status(error.code).json({
		error: {
			id: errorId,
			code: error.code,
			message: error.message,
			errorCode: error.errorCode,
			errorType: error.errorType,
			payload: error.payload
		}
	});
};
