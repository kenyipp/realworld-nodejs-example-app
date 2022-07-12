"use strict";

const PromiseRouter = require("express-promise-router");
const auth = require("../utils/auth");
const controller = require("./profile.controller");

const router = PromiseRouter();

router.get("/:username", controller.get);

router
	.route("/:username/follow")
	.post(auth, controller.follow)
	.delete(auth, controller.unfollow);

module.exports = router;
