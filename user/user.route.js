"use strict";

const PromiseRouter = require("express-promise-router");
const validate = require("express-joi-verifier");
const auth = require("../utils/auth");
const controller = require("./user.controller");
const schema = require("./user.schema");

const router = PromiseRouter();

router.post(
	"/users/login",
	validate.body(schema.login),
	controller.login
);

router.post(
	"/users",
	validate.body(schema.register),
	controller.register
);

router
	.route("/user")
	.get(auth, controller.getMe)
	.put(auth, controller.update);

module.exports = router;
