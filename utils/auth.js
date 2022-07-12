"use strict";

const jsonwebtoken = require("jsonwebtoken");
const User = require("../user/user.model");

async function auth(req, res, next) {
	const { authorization } = req.headers;

	if (!authorization) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Missing authorization header"
				}
			});
	}

	const [policy, token] = authorization.split(" ");

	if (policy.toLowerCase() !== "bearer") {
		return res
			.status(403)
			.json({
				errors: {
					message: "Invalid authorization policy"
				}
			});
	}

	let decoded;

	try {
		decoded = jsonwebtoken.verify(token, process.env.AUTH_SIGNATURE);
	} catch (error) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Invalid token"
				}
			});
	}

	const user = await User.getById(decoded.id);

	if (!user) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Invalid request"
				}
			});
	}

	req.user = user;
	return next();
}

function optional(req, res, next) {
	const { authorization } = req.headers;

	if (authorization) {
		return auth(req, res, next);
	}

	return next();
}

module.exports = auth;
module.exports.auth = auth;
module.exports.optional = optional;
