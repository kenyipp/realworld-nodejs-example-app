"use strict";

const Bluebird = require("bluebird");
const Article = require("./article.model");
const knex = require("../utils/database");
const logger = require("../utils/logger");

async function list(req, res) {
	const { user, query: payload } = req;

	let query = knex
		.table({ article: "Article" })
		.where("RecStatus", "A"); // Select only the available articles (not being deleted or banned)

	if (payload.tag) {
		query = query.whereExists(
			function () {
				this
					.from({ tag: "ArticleTag" })
					.whereRaw("tag.ArticleId = article.ArticleId")
					.where("Tag", payload.tag)
					.limit(1);
			}
		);
	}

	if (payload.author) {
		query = query.whereExists(
			function () {
				this
					.from({ user: "User" })
					.whereRaw("user.UserId = article.UserId")
					.where("Username", payload.author)
					.limit(1);
			}
		);
	}

	if (payload.favorited) {
		query = query.whereExists(
			function () {
				this
					.from({ favorited: "ArticleFavorite" })
					.whereRaw("favorited.ArticleId = article.ArticleId")
					.where(
						"favorited.UserId",
						knex
							.select("UserId")
							.table("User")
							.where("Username", payload.favorited)
					)
					.limit(1);
			}
		);
	}

	// Used by Feed routes
	if (payload.followedBy) {
		query = query.whereExists(
			function () {
				this
					.from({ followed: "UserFollow" })
					.whereRaw("followed.FollowUser = article.UserId")
					.where(
						"followed.UserId",
						payload.followedBy
					)
					.limit(1);
			}
		);
	}

	const response = await Bluebird.props({
		articles: query
			.clone()
			.select("slug")
			.limit(payload.limit)
			.offset(payload.limit * payload.offset)
			.orderBy("EnterDate", "DESC")
			.then((articles) => Article.findBySlugs(articles.map((item) => item.slug), user?.id)),
		articlesCount: query
			.clone()
			.count("*", { as: "count" })
			.then((count) => count[0].count)
	});

	return res.json(response);
}

function feed(req, res) {
	const { user, query: payload } = req.user;

	payload.followedBy = user.id;

	return list(req, res);
}

function get(req, res) {
	return res.json({ article: req.article });
}

async function create(req, res) {
	const { user } = req;
	const payload = req.body.article;

	try {
		const article = await Article.create(
			payload.title,
			payload.descripiton,
			payload.body,
			payload.tagList,
			user.id
		);

		return res.json({ article });
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					errors: {
						message: "The article title has been used. Please enter another title."
					}
				});
		}

		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}
}

async function getArticle(req, res, next, slug) {
	const { user } = req;
	const article = await Article.getBySlug(slug, user?.id);

	if (!article) {
		return res
			.status(400)
			.json({
				errors: {
					message: `Article with slug ${slug} not found`
				}
			});
	}

	req.article = article;
	return next();
}

async function update(req, res) {
	let { article } = req;
	const paylaod = req.body.article;

	try {
		article = await article.update(
			paylaod.title,
			paylaod.description,
			paylaod.body
		);
	} catch (error) {
		if (error.code === "ER_DUP_ENTRY") {
			return res
				.status(400)
				.json({
					errors: {
						message: "The article title has been used by another article"
					}
				});
		}

		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}

	return res.json({ article });
}

async function remove(req, res) {
	const { article } = req;

	try {
		await article.remove();
		return res.json({});
	} catch (error) {
		// Log the internal error for debugging
		logger.error(error, { label: "Article" });
		return res.status(500).json();
	}
}

async function allowAuthorOnly(req, res, next) {
	const { user, article } = req;

	if (!user || user.id !== article.author.id) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Only the author of the article can update or delete the article"
				}
			});
	}

	return next();
}

async function addComment(req, res) {
	const { user, article } = req;
	const payload = req.body.comment;

	if (!user) {
		return res
			.status(403)
			.send({
				errors: {
					message: "Please login before adding new comment"
				}
			});
	}

	const comment = await article.addComment(payload.body, user.id);
	return res.json({ comment });
}

// Consider adding pagination once the quantity of comments grows.
async function getComment(req, res) {
	const { article } = req;

	const ids = await knex
		.table("ArticleComment")
		.select({ id: "ArticleCommentId" })
		.where({ ArticleId: article.id })
		.then((comments) => comments.map((comment) => comment.id));

	const comments = await Article.listComments(ids);

	return res.json({ comments });
}

async function removeComment(req, res) {
	const { id } = req.params;
	const { user } = req;

	const comment = await Article.getComment(id);

	if (!comment) {
		return res
			.status(400)
			.json({
				errors: {
					message: "Invalid comment id"
				}
			});
	}

	if (!user || user.id !== comment.author.id) {
		return res
			.status(403)
			.json({
				errors: {
					message: "You are not allowed to remove a comment that does not belong to you."
				}
			});
	}

	await Article.removeComment(id);

	return res.send();
}

async function favorite(req, res) {
	const { user } = req;
	let { article } = req;

	if (!user) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Please login before favorite an article"
				}
			});
	}

	article = await article.favorite(user.id);

	return res.json({ article });
}

async function unfavorite(req, res) {
	const { user } = req;
	let { article } = req;

	if (!user) {
		return res
			.status(403)
			.json({
				errors: {
					message: "Please login before unfavorite an article"
				}
			});
	}

	article = await article.unfavorite(user.id);

	return res.json({ article });
}

module.exports = {
	list,
	feed,
	get,
	create,
	getArticle,
	update,
	remove,
	allowAuthorOnly,
	addComment,
	getComment,
	removeComment,
	favorite,
	unfavorite
};
