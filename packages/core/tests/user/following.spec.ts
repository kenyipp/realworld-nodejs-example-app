import assert from 'assert';
import { Chance } from 'chance';

import { InvalidFollowError, ServiceFactory } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import {
  CreateUserHandler,
  FollowHandler
} from '@conduit/core/service/user/implementations';

describe('User Service - Following', () => {
  describe('Follow an User', () => {
    it('should be able to follow an user', async () => {
      const { followHandler, userAId, userBUsername, repoUser } = await setup();

      await followHandler.followUser({
        followerId: userAId,
        followingUsername: userBUsername
      });

      const userB = await repoUser.getUserProfile({
        username: userBUsername,
        requestingUserId: userAId
      });

      assert(userB);
      expect(userB.following).toBe(true);
    });

    it('should throw an error if the user is already following the targeted user', async () => {
      const { followHandler, userAId, userBUsername } = await setup();

      await followHandler.followUser({
        followerId: userAId,
        followingUsername: userBUsername
      });

      try {
        await followHandler.followUser({
          followerId: userAId,
          followingUsername: userBUsername
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidFollowError);
      }
    });

    it('should throw an error if the user is trying to follow themselves', async () => {
      const { followHandler, userAId, userAUsername } = await setup();

      try {
        await followHandler.followUser({
          followerId: userAId,
          followingUsername: userAUsername
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidFollowError);
      }
    });
  });

  describe('Unfollow an User', () => {
    it('should be able to unfollow an user', async () => {
      const { followHandler, userAId, userBUsername, repoUser } = await setup();

      await followHandler.followUser({
        followerId: userAId,
        followingUsername: userBUsername
      });

      await followHandler.unfollowUser({
        followerId: userAId,
        followingUsername: userBUsername
      });

      const userB = await repoUser.getUserProfile({
        username: userBUsername,
        requestingUserId: userAId
      });

      assert(userB);
      expect(userB.following).toBe(false);
    });

    it('should throw an error if the user is trying to unfollow a user that they are not currently following', async () => {
      const { followHandler, userAId, userBUsername } = await setup();

      try {
        await followHandler.unfollowUser({
          followerId: userAId,
          followingUsername: userBUsername
        });
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidFollowError);
      }
    });
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const repoFactory = new RepoFactory();
  const serviceFactory = new ServiceFactory();
  const authService = serviceFactory.newAuthService();
  const repoUser = repoFactory.newRepoUser();
  const followHandler = new FollowHandler({ repoUser });
  const createUserHandler = new CreateUserHandler({ repoUser, authService });

  const userAUsername = chance.word();

  const userAId = await createUserHandler.createUser({
    username: userAUsername,
    email: chance.email(),
    password: 'Abcd1234'
  });

  const userBUsername = chance.word();

  const userBId = await createUserHandler.createUser({
    username: userBUsername,
    email: chance.email(),
    password: 'Abcd1234'
  });

  return {
    chance,
    followHandler,
    repoUser,
    userAId,
    userAUsername,
    userBId,
    userBUsername
  };
};
