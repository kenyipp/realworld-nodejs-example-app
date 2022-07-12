"use strict";

const _ = require("lodash");
const User = require("../user/user.model");

async function get(req, res) {
	const { user } = req;
	const { username } = req.params;

	const profile = await User.getByUsername(username);

	if (!profile) {
		return res
			.status(400)
			.json({
				errors: {
					message: `User ${username} is not found in database`
				}
			});
	}

	// If the user has passed the authorization token, check if he is following this user.
	const isFollowing = _.isNil(user) ? false : await profile.isBeingFollowing(user.id);

	return res.send({
		profile: {
			username: profile.username,
			bio: profile.bio,
			image: profile.image,
			following: isFollowing
		}
	});
}

function getProfileFieldsFromUser(user) {
	return _.pick(user, ["username", "bio", "image", "following"]);
}

async function follow(req, res) {
	const { user } = req;
	const { username } = req.params;

	if (user.username === username) {
		return res
			.status(400)
			.json({ errors: { message: "You can't follow or unfollow yourself" } });
	}

	let profile = await User.getByUsername(username);

	if (!profile) {
		return res
			.status(400)
			.json({
				errors: {
					message: `User ${username} is not found in database`
				}
			});
	}

	await user.follow(profile.id);

	profile = await User
		.getById(profile.id)
		.then((newUser) => {
			newUser.following = true;
			return getProfileFieldsFromUser(newUser);
		});

	return res.send({ profile });
}

async function unfollow(req, res) {
	const { user } = req;
	const { username } = req.params;

	if (user.username === username) {
		return res
			.status(400)
			.json({ errors: { message: "You can't follow or unfollow yourself" } });
	}

	let profile = await User.getByUsername(username);

	if (!profile) {
		return res
			.status(400)
			.json({
				errors: {
					message: `User ${username} is not found in database`
				}
			});
	}

	await user.unfollow(profile.id);

	profile = await User
		.getById(profile.id)
		.then((newUser) => {
			newUser.following = false;
			return getProfileFieldsFromUser(newUser);
		});

	return res.send({ profile });
}

module.exports = {
	get,
	follow,
	unfollow
};
