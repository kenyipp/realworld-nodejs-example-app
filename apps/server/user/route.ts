import Router from "express-promise-router";
import { isNil } from "lodash";
import { Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { type Handler } from "express";
import { APIErrorInternalServerError } from "@conduit/utils";
import {
	APIFollowUser,
	APIGetCurrentUser,
	APIGetProfile,
	APIRegistration,
	APIUnfollowUser,
	APIUpdateUser,
	APIUserLogin
} from "./service";
import {
	auth,
	authRequired,
	validate
} from "../middleware";
import type {
	DtoInputLogin,
	DtoInputRegistration,
	DtoInputUpdateUser
} from "./dto";
import {
	loginSchema,
	registrationSchema,
	updateUserSchema
} from "./schema";

export const router = Router();
const factory = new Factory();
const authService = factory.newAuthService();
const userService = factory.newUserService();

const apiFollowUser = new APIFollowUser({ userService });
const apiUnfollowUser = new APIUnfollowUser({ userService });
const apiGetCurrentUser = new APIGetCurrentUser();
const apiUpdateUser = new APIUpdateUser({ userService });
const apiGetProfile = new APIGetProfile({ userService });
const apiRegistration = new APIRegistration({ userService });
const apiUserLogin = new APIUserLogin({ authService, userService });

const login: Handler = async (req, res) => {
	const input: DtoInputLogin = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(input),
		cause: new Error("The request body is missing")
	});

	const response = await apiUserLogin.execute({ input });
	return res.json(response);
};

const registration: Handler = async (req, res) => {
	const input: DtoInputRegistration = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(input),
		cause: new Error("The request body is missing")
	});

	const response = await apiRegistration.execute({ input });
	return res.json(response);
};

const getCurrentUser: Handler = (req, res) => {
	const { user } = req;
	const response = apiGetCurrentUser.execute({ dbDtoUser: user });
	return res.json(response);
};

const updateUser: Handler = async (req, res) => {
	const { user } = req;
	const updates: DtoInputUpdateUser = req.body.user;

	APIErrorInternalServerError.assert({
		condition: !isNil(updates),
		cause: new Error("Missing request parameters 'userId' and/or request body")
	});

	const response = await apiUpdateUser.execute({ user, updates });
	return res.json(response);
};

const getProfile: Handler = async (req, res) => {
	const { user } = req;
	const { username } = req.params;

	APIErrorInternalServerError.assert({
		condition: !isNil(username),
		cause: new Error("Missing request parameters 'username'")
	});

	const response = await apiGetProfile.execute({ user, username });
	return res.json(response);
};

const followUser: Handler = async (req, res) => {
	const { user } = req;
	const { username } = req.params;
	const response = await apiFollowUser.execute({ user, username });
	return res.json(response);
};

const unfollowUser: Handler = async (req, res) => {
	const { user } = req;
	const { username } = req.params;
	const response = await apiUnfollowUser.execute({ user, username });
	return res.json(response);
};

router.post(ServerPath.Login, validate.body(loginSchema), login);
router.get(ServerPath.GetCurrentUser, authRequired, getCurrentUser);
router.put(ServerPath.UpdateUser, authRequired, validate.body(updateUserSchema), updateUser);
router.get(ServerPath.GetProfile, auth, getProfile);
router.post(ServerPath.Registration, validate.body(registrationSchema), registration);
router.post(ServerPath.FollowUser, authRequired, followUser);
router.delete(ServerPath.UnfollowUser, authRequired, unfollowUser);
