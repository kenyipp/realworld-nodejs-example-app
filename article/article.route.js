"use strict";

const PromiseRouter = require("express-promise-router");
const validate = require("express-joi-verifier");
const auth = require("../utils/auth");
const controller = require("./article.controller");
const schema = require("./article.schema");

const router = PromiseRouter();

router
	.route("/")
	.get(
		auth.optional,
		validate.query(schema.list),
		controller.list
	)
	.post(
		auth,
		validate.body(schema.create),
		controller.create
	);

router.get(
	"/feed",
	auth,
	validate.query(schema.feed),
	controller.feed
);

router
	.route("/:slug")
	.get(controller.get)
	.put(controller.allowAuthorOnly, controller.update)
	.delete(controller.allowAuthorOnly, controller.remove);

router
	.route("/:slug/comments")
	.get(controller.getComment)
	.post(controller.addComment);

router.delete("/:slug/comments/:id", controller.removeComment);

router
	.route("/:slug/favorite")
	.post(controller.favorite)
	.delete(controller.unfavorite);

router.param(
	"slug",
	(req, res, next, id) => {
		// Authenticate the user before getting the article
		auth.optional(
			req,
			res,
			controller.getArticle.bind(null, req, res, next, id)
		);
	}
);

module.exports = router;
