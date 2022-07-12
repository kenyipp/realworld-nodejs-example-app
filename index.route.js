"use strict";

const express = require("express");

const logger = require("./utils/logger");

const router = express.Router();

router.get(
	"/health-check",
	(req, res) => res.send("OK")
);

router.use("/", require("./user/user.route"));

router.use("/profiles", require("./profile/profile.route"));

router.use("/articles", require("./article/article.route"));

router.use("/tags", require("./tag/tag.route"));

router.use((error, req, res, next) => {
	if (error.isAppError) {
		error.status = error.statusCode || 400;
	}

	// customize Joi validation errors
	if (error.isJoi) {
		res
			.status(422)
			.json({
				errors: {
					body: error.details.map((item) => item.message)
				}
			});
		return next(error);
	}

	switch (error.status) {
		case 400:
		case 401:
		case 403:
		case 404:
			res.status(error.status).json({});
			break;

		case 500:
		default:
			logger.error(error, { label: "Unexpected Error" });
			res.status(500).json({});
			break;
	}

	return next(error);
});

module.exports = router;
