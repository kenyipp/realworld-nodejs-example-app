import { Handler } from "express";
import Router from "express-promise-router";

import { Factory } from "@conduit/core";
import { ServerPath } from "@conduit/types";
import { APIErrorInternalServerError } from "@conduit/utils";

import { auth, authRequired, validate } from "../middleware";
import {
	DtoInputAddComment,
	DtoInputCreateArticle,
	DtoInputGetArticleFeed,
	DtoInputGetArticles,
	DtoInputUpdateArticle
} from "./dto";
import {
	addCommentSchema,
	createArticleSchema,
	getArticleFeedSchema,
	getArticlesSchema,
	updateArticleSchema
} from "./schema";
import {
	APIAddComments,
	APICreateArticle,
	APIDeleteArticle,
	APIDeleteComment,
	APIFavoriteArticle,
	APIFeedArticles,
	APIGetArticle,
	APIGetComments,
	APIGetTags,
	APIListArticles,
	APIUnfavoriteArticle,
	APIUpdateArticle
} from "./service";

export const router = Router();
const factory = new Factory();
const articleService = factory.newArticleService();
const userService = factory.newUserService();

const apiAddComments = new APIAddComments({ articleService });
const apiCreateArticle = new APICreateArticle({ articleService });
const apiDeleteArticle = new APIDeleteArticle({ articleService });
const apiDeleteComment = new APIDeleteComment({ articleService });
const apiFavoriteArticle = new APIFavoriteArticle({
	articleService,
	userService
});
const apiFeedArticles = new APIFeedArticles({ articleService, userService });
const apiGetArticle = new APIGetArticle({ articleService, userService });
const apiGetComments = new APIGetComments({ articleService, userService });
const apiGetTags = new APIGetTags({ articleService });
const apiListArticles = new APIListArticles({ articleService, userService });
const apiUnfavoriteArticle = new APIUnfavoriteArticle({
	articleService,
	userService
});
const apiUpdateArticle = new APIUpdateArticle({ articleService });

const getFeedArticles: Handler = async (req, res) => {
	const { user } = req;
	if (!user) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const input = req.query as unknown as DtoInputGetArticleFeed;
	const response = await apiFeedArticles.execute({ input, user });
	res.json(response);
};

const getArticles: Handler = async (req, res) => {
	const { user } = req;
	const input = req.query as unknown as DtoInputGetArticles;
	const response = await apiListArticles.execute({ input, user });
	res.json(response);
};

const createArticle: Handler = async (req, res) => {
	const { user } = req;
	if (!user) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const input: DtoInputCreateArticle = req.body.article;
	const response = await apiCreateArticle.execute({ input, user });
	res.json(response);
};

const getArticle: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiGetArticle.execute({ slug, user });
	res.json(response);
};

const updateArticle: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const input: DtoInputUpdateArticle = req.body.article;
	const response = await apiUpdateArticle.execute({ slug, user, input });
	return res.json(response);
};

const deleteArticle: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiDeleteArticle.execute({ slug, user });
	return res.json(response);
};

const getComments: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiGetComments.execute({ slug, user });
	return res.json(response);
};

const addComment: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	const input: DtoInputAddComment = req.body.comment;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiAddComments.execute({ slug, user, input });
	return res.json(response);
};

const deleteComment: Handler = async (req, res) => {
	const { user } = req;
	const { id: commentId } = req.params;
	if (!user || !commentId) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiDeleteComment.execute({ commentId, user });
	return res.json(response);
};

const favoriteArticle: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiFavoriteArticle.execute({ slug, user });
	return res.json(response);
};

const unfavoriteArticle: Handler = async (req, res) => {
	const { user } = req;
	const { slug } = req.params;
	if (!user || !slug) {
		throw new APIErrorInternalServerError({
			cause: new Error(
				"Missing required parameters. Check router settings."
			)
		});
	}
	const response = await apiUnfavoriteArticle.execute({ slug, user });
	return res.json(response);
};

const getArticleTags: Handler = async (req, res) => {
	const response = await apiGetTags.execute();
	return res.json(response);
};

router.get(
	ServerPath.FeedArticles,
	authRequired,
	validate.query(getArticleFeedSchema),
	getFeedArticles
);
router.get(
	ServerPath.ListArticles,
	auth,
	validate.query(getArticlesSchema),
	getArticles
);
router.post(
	ServerPath.CreateArticle,
	authRequired,
	validate.body(createArticleSchema),
	createArticle
);
router.get(ServerPath.GetArticle, auth, getArticle);
router.put(
	ServerPath.UpdateArticle,
	authRequired,
	validate.body(updateArticleSchema),
	updateArticle
);
router.delete(ServerPath.DeleteArticle, authRequired, deleteArticle);
router.get(ServerPath.GetCommentsFromAnArticle, auth, getComments);
router.post(
	ServerPath.AddCommentToAnArticle,
	authRequired,
	validate.body(addCommentSchema),
	addComment
);
router.delete(ServerPath.DeleteComment, authRequired, deleteComment);
router.post(ServerPath.FavoriteArticle, authRequired, favoriteArticle);
router.delete(ServerPath.UnfavoriteArticle, authRequired, unfavoriteArticle);
router.get(ServerPath.GetTags, getArticleTags);
