"use strict";

const _ = require("lodash");
const UUID = require("uuid");
const crypto = require("crypto");
const moment = require("moment");
const jsonwebtoken = require("jsonwebtoken");

const knex = require("../utils/database");

function User(body) {
	if (!(this instanceof User)) {
		return new User(body);
	}

	_.assign(this, body);
}

User.findOne = async function (key, value) {
	const doc = await knex
		.table("User")
		.first("UserId as id", "email", "username", "bio", "image")
		.where(key, value);

	if (doc) {
		return new this(doc);
	}

	return null;
};

// Get the user document by UserId
User.getById = function (id) {
	return this.findOne("UserId", id);
};

User.getByEmail = function (email) {
	return this.findOne("Email", email);
};

User.getByUsername = async function (username) {
	return this.findOne("Username", username);
};

User.register = async function (username, email, password) {
	// Create a random salt for hashing the password
	const salt = crypto.randomBytes(16).toString("hex");

	// Hashing the password from the salt generated
	const hash = crypto.pbkdf2Sync(password, salt, 100, 32, "sha256").toString("hex");

	const userId = await knex
		.table("User")
		.insert({
			username,
			email,
			hash,
			salt
		})
		.then((response) => response[0]); // The inserted UserId

	return this.getById(userId);
};

User.prototype.validate = async function (password) {
	const {
		salt,
		hash
	} = await knex
		.table("User")
		.first("hash", "salt")
		.where("UserId", this.id);

	const hashed = crypto.pbkdf2Sync(password, salt, 100, 32, "sha256").toString("hex");
	return hashed === hash;
};

User.prototype.update = async function (payload) {
	const updates = {
		email: payload.email,
		username: payload.username,
		image: payload.image,
		bio: payload.bio
	};

	if (payload.password) {
		updates.salt = crypto.randomBytes(16).toString("hex");
		updates.hash = crypto.pbkdf2Sync(payload.password, updates.salt, 100, 32, "sha256").toString("hex");
	}

	await knex("User")
		.update(updates)
		.where("UserId", this.id);

	return User.getById(this.id);
};

User.prototype.generateJWTToken = function () {
	return jsonwebtoken.sign(
		{
			version: 1,
			auth_time: moment().unix(),
			id: this.id,
			email: this.email
		},
		process.env.AUTH_SIGNATURE,
		{
			expiresIn: "10 days",
			issuer: "Ken Yip",
			audience: [
				"*.kenyip.cc"
			],
			jwtid: UUID.v4()
		}
	);
};

User.prototype.isBeingFollowing = function (userId) {
	return knex
		.table("User")
		.first(["followUser", "userId"])
		.where("FollowUser", this.id)
		.andWhere("UserId", userId)
		.then((doc) => !_.isNil(doc));
};

User.prototype.follow = function (userId) {
	return knex
		.table("UserFollow")
		.insert({ FollowUser: userId, UserId: this.id })
		.onConflict()
		.ignore();
};

User.prototype.unfollow = function (userId) {
	return knex
		.table("UserFollow")
		.where({ FollowUser: userId, UserId: this.id })
		.delete();
};

module.exports = User;
