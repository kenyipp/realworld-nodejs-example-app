import Router from "express-promise-router";

import { ServerPath } from "@conduit/types";

import { auth, authRequired, validate } from "../middleware";
import {
	followUser,
	getCurrentUser,
	getProfile,
	login,
	registration,
	unfollowUser,
	updateUser
} from "./controller";
import { loginSchema, registrationSchema, updateUserSchema } from "./schema";

export const router = Router();

router.post(ServerPath.Login, validate.body(loginSchema), login);
router.get(ServerPath.GetCurrentUser, authRequired, getCurrentUser);
router.put(
	ServerPath.UpdateUser,
	authRequired,
	validate.body(updateUserSchema),
	updateUser
);
router.get(ServerPath.GetProfile, auth, getProfile);
router.post(
	ServerPath.Registration,
	validate.body(registrationSchema),
	registration
);
router.post(ServerPath.FollowUser, authRequired, followUser);
router.delete(ServerPath.UnfollowUser, authRequired, unfollowUser);
