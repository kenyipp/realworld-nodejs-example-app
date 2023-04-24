import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { isNil } from "lodash";

import { APIErrorUnprocessableEntity } from "@conduit/utils";

/**
 *
 * Validates the request parameters, query parameters or request body against a Joi schema.
 * If validation fails, an APIErrorUnprocessableEntity will be thrown with a payload containing
 * an array of error messages describing the validation errors.
 *
 * @param {ValidationType} - the of the request data to be validated (query, body or params)
 *
 */
const validate =
	(type: ValidationType) =>
	(input: Joi.AnySchema) =>
	(req: Request, _res: Response, next: NextFunction) => {
		const { value, error } = input.validate(req[type], {
			abortEarly: false
		});
		APIErrorUnprocessableEntity.assert({
			condition: isNil(error),
			message:
				"Invalid or missing data in the request body. Please ensure all required fields are included and in the correct format.",
			cause: error,
			payload: mapValidationError(error)
		});
		req[type] = value;
		return next();
	};

/**
 *
 * Maps the validation error messages to an array of strings.
 *
 * @param {Joi.ValidationError} error - the Joi validation error object
 *
 * @returns {string[]} an array of error messages describing the validation errors
 *
 */
const mapValidationError = (error?: Joi.ValidationError): string[] => {
	if (!error) {
		return [];
	}
	const details = error.details.map((detail) => {
		if (detail.type === "any.required") {
			return `The '${detail.path.join(
				"."
			)}' field is required but was not provided`;
		}
		if (detail.type.endsWith(".base")) {
			return `Expected '${detail.path.join(".")}' to be a ${
				detail.type.split(".")[0]
			}, but received '${typeof detail?.context?.value}' instead`;
		}
		return detail.message;
	});
	return details;
};

/**
 *
 * Enumeration for the of data to validate.
 *
 */
enum ValidationType {
	Query = "query",
	Body = "body",
	Params = "params"
}

/**
 *
 * Validates the query parameter based on the provided Joi schema.
 *
 * @function
 *
 * @param {Joi.AnySchema} input - The Joi schema to validate against.
 *
 * @returns {Function} Express middleware function to validate the query parameter.
 *
 */
export const query = validate(ValidationType.Query);

/**
 *
 * Validates the request body based on the provided Joi schema.
 *
 * @function
 *
 * @param {Joi.AnySchema} input - The Joi schema to validate against.
 *
 * @returns {Function} Express middleware function to validate the query parameter.
 *
 */
export const body = validate(ValidationType.Body);

/**
 *
 * Validates the request parameters based on the provided Joi schema.
 *
 * @function
 *
 * @param {Joi.AnySchema} input - The Joi schema to validate against.
 *
 * @returns {Function} Express middleware function to validate the query parameter.
 *
 */
export const params = validate(ValidationType.Params);
