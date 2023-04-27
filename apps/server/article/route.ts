import Router from "express-promise-router";

import { ServerPath } from "@conduit/types";

import { auth, authRequired, validate } from "../middleware";
import {
	addComment,
	createArticle,
	deleteArticle,
	deleteComment,
	favoriteArticle,
	getArticle,
	getArticleTags,
	getArticles,
	getComments,
	getFeedArticles,
	unfavoriteArticle,
	updateArticle
} from "./controller";
import {
	addCommentSchema,
	createArticleSchema,
	getArticleFeedSchema,
	getArticlesSchema,
	updateArticleSchema
} from "./schema";

export const router = Router();

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
