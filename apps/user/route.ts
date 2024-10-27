import Router from 'express-promise-router';

import { auth, authRequired } from '@conduit/middleware';

import {
  followUser,
  getCurrentUser,
  getUserProfile,
  login,
  registration,
  unfollowUser,
  updateUser
} from './controller';

export const router = Router();

router.post('/api/users/login', login);
router.post('/api/users', registration);

router
  .route('/api/user')
  .put(authRequired, updateUser)
  .get(authRequired, getCurrentUser);

router.get('/api/profiles/:username', auth, getUserProfile);

router
  .route('/api/profiles/:username/follow')
  .post(authRequired, followUser)
  .delete(authRequired, unfollowUser);
