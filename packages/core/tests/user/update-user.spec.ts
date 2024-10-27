import assert from 'assert';
import { Chance } from 'chance';

import { ServiceFactory, UserExistError } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import { UpdateUserHandler } from '@conduit/core/service/user/implementations';

describe('User Service - Update User', () => {
  it('should be able to update the user', async () => {
    const { updateUserHandler, userABody, userAId, chance, repoUser } =
      await setup();
    const email = chance.email();
    const bio = chance.sentence();
    const image = chance.url();

    await updateUserHandler.execute({
      id: userAId,
      email,
      bio,
      image
    });

    const user = await repoUser.getUserById({ id: userAId });

    assert(!!user);
    expect(user).toBeDefined();
    expect(user.username).toEqual(userABody.username);
    expect(user.email).toEqual(email);
    expect(user.bio).toEqual(bio);
    expect(user.image).toEqual(image);
  });

  it('should be able to update only the provided fields', async () => {
    const { updateUserHandler, userABody, userAId, chance, repoUser } =
      await setup();
    const email = chance.email();
    const image = chance.url();

    await updateUserHandler.execute({
      id: userAId,
      email,
      image
    });

    const user = await repoUser.getUserById({ id: userAId });

    assert(!!user);
    expect(user).toBeDefined();
    expect(user.username).toEqual(userABody.username);
    expect(user.email).toEqual(email);
    expect(user.bio).toBeNull();
    expect(user.image).toEqual(image);
  });

  it('should throw an error if user tries to update their email with an existing username', async () => {
    const { updateUserHandler, userAId, userBBody } = await setup();

    try {
      await updateUserHandler.execute({
        id: userAId,
        email: userBBody.email
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UserExistError);
    }
  });

  it('should throw an error if user tries to update their email with an existing email address', async () => {
    const { updateUserHandler, userAId, userBBody } = await setup();

    try {
      await updateUserHandler.execute({
        id: userAId,
        email: userBBody.email
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UserExistError);
    }
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const repoFactory = new RepoFactory();
  const serviceFactory = new ServiceFactory();
  const repoUser = repoFactory.newRepoUser();
  const authService = serviceFactory.newAuthService();
  const userService = serviceFactory.newUserService();
  const updateUserHandler = new UpdateUserHandler({ repoUser, authService });

  const userABody = {
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  };

  const userBBody = {
    username: chance.word(),
    email: chance.email(),
    password: 'Abcd1234'
  };

  const userAId = await userService.createUser(userABody);
  const userBId = await userService.createUser(userBBody);

  return {
    chance,
    updateUserHandler,
    repoUser,
    userABody,
    userAId,
    userBBody,
    userBId
  };
};
