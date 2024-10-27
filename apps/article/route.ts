import Router from 'express-promise-router';

import { auth, authRequired } from '@conduit/middleware';

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
} from './controller';

export const router = Router();

router
  .route('/api/articles/:slug/comments')
  .get(auth, getComments)
  .post(authRequired, addComment);

router.delete('/api/articles/:slug/comments/:id', authRequired, deleteComment);

router
  .route('/api/articles/:slug/favorite')
  .post(authRequired, favoriteArticle)
  .delete(authRequired, unfavoriteArticle);

router.get('/api/articles/feed', authRequired, getFeedArticles);

router
  .route('/api/articles/:slug')
  .get(auth, getArticle)
  .put(authRequired, updateArticle)
  .delete(authRequired, deleteArticle);

router
  .route('/api/articles')
  .get(auth, getArticles)
  .post(authRequired, createArticle);

router.get('/api/tags', getArticleTags);

router
  .route('/api/articles/:slug/favorite')
  .post(authRequired, favoriteArticle)
  .delete(authRequired, unfavoriteArticle);
