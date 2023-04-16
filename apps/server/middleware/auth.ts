import { isNil } from "lodash";
import { APIErrorForbidden, APIErrorInternalServerError, APIErrorUnauthorized } from "@conduit/utils";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Factory } from "@conduit/core";
import type { Request, Response, NextFunction } from "express";
import { UserStatus } from "@conduit/types";
import { hashDbDtoUser, verifyJsonWebToken } from "../utils/jsonWebTokenHelper";
import { ErrorCodes } from "../constants";

const userService = Factory
	.getInstance()
	.newUserService();

/**
 *
 * Middleware function that checks if the request has a valid authorization token and
 * sets the authenticated user in the request object.
 *
 *  @async
 * @param {Request} req - The request object.
 * @param {Response} _res - The response object (unused).
 * @param {NextFunction} next - The next middleware function.

 * @throws {APIErrorUnauthorized} If the request is missing an authorization token or if the
 * provided token is invalid or expired.
 *
 */
export const auth = async (req: Request, _res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	if (isNil(authorization)) {
		return next();
	}

	const [policy, accessToken] = authorization.split(" ");

	APIErrorUnauthorized.assert({
		condition: policy.toLowerCase() === "bearer",
		errorCode: ErrorCodes.InvalidAuthenticationScheme,
		message: "The provided authentication scheme is not supported. Please use a bearer token."
	});

	try {
		const decoded = verifyJsonWebToken({ accessToken });
		const user = await userService.getUserById({ id: decoded.userId });
		if (decoded.hash !== hashDbDtoUser({ dbDtoUser: user })) {
			throw new TokenExpiredError(
				"As one of the user's login credentials has been updated, please obtain a new token.",
				user.updatedAt
			);
		}
		APIErrorForbidden.assert({
			condition: user.statusId !== UserStatus.Banned,
			message: "Sorry, your account has been banned. Please contact the support team for further information."
		});
		req.user = user;
		return next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			throw new APIErrorUnauthorized({
				errorCode: ErrorCodes.ExpiredToken,
				message: "The provided token has expired. Please obtain a new token.",
				cause: error
			});
		}
		if (error instanceof JsonWebTokenError) {
			throw new APIErrorUnauthorized({
				errorCode: ErrorCodes.ExpiredToken,
				message: "Sorry, your login is invalid. Please try again or contact support for help.",
				cause: error
			});
		}
		return next(error);
	}
};

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
	const { authorization } = req.headers;

	APIErrorUnauthorized.assert({
		condition: !isNil(authorization),
		message: "Authentication required. Please provide valid credentials to access this resource."
	});

	return auth(req, res, (error: any) => {
		if (error) {
			return next(error);
		}
		const { user } = req;
		APIErrorInternalServerError.assert({
			condition: !isNil(user),
			cause: new Error("The user object should not be null")
		});
		return next();
	});
};