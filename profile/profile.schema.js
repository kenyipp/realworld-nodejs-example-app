"use strict";

const _ = require("lodash");
const Joi = require("joi");

const User = require("../user/user.schema");

const profile = User
	.doc
	.keys({
		following: Joi
			.boolean()
			.description("Variable that indicates the authenticated user is following the target user or not")
			.default(false)
	})
	.remove("token");

// _.remove(profile._inner.children, item => item.key == "token");

module.exports = {
	doc: profile
};