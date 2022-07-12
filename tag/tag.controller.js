"use strict";

const knex = require("../utils/database");

async function list(req, res) {
	const tags = await knex
		.select({ tag: "Tag" })
		.from("ArticleTag")
		.groupBy("tag")
		.orderBy(knex.raw("COUNT(*)"))
		.then((_tags) => _tags.map((tag) => tag.tag));

	return res.json({ tags });
}

module.exports = {
	list
};
