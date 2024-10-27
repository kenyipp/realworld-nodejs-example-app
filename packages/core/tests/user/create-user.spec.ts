import assert from 'assert';
import { Chance } from 'chance';

import { ServiceFactory, UserExistError, UserStatus } from '@conduit/core';
import { dangerouslyResetDb } from '@conduit/core/database';
import { RepoFactory } from '@conduit/core/repository';
import { CreateUserHandler } from '@conduit/core/service/user/implementations';

describe('User Service - Create User', () => {
  it('should be able to create an user', async () => {
    const { createUserHandler, chance, repoUser } = await setup();
    const username = chance.word();
    const email = chance.email();
    const password = 'Abcd1234';

    const userId = await createUserHandler.createUser({
      username,
      email,
      password
    });

    const user = await repoUser.getUserById({ id: userId });
    assert(!!user);

    expect(user).toBeDefined();
    expect(user.username).toEqual(username);
    expect(user.email).toEqual(email);
    expect(user.recordStatus).toEqual(UserStatus.Active);
    expect(user.bio).toBeNull();
    expect(user.image).toBeNull();
  });

  it('should throw an error if the username is already taken', async () => {
    const { createUserHandler, chance } = await setup();
    const username = chance.word();
    const email = chance.email();
    const password = 'Abcd1234';

    await createUserHandler.createUser({
      username,
      email,
      password
    });

    try {
      await createUserHandler.createUser({
        username,
        email: chance.email(),
        password
      });
      assert.fail('Should have thrown an error');
    } catch (error) {
      expect(error).toBeInstanceOf(UserExistError);
    }
  });

  it('should throw an error if the email has already been used', async () => {
    const { createUserHandler, chance } = await setup();
    const username = chance.word();
    const email = chance.email();
    const password = 'Abcd1234';

    await createUserHandler.createUser({
      username,
      email,
      password
    });

    try {
      await createUserHandler.createUser({
        username: chance.word(),
        email,
        password
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
  const createUserHandler = new CreateUserHandler({ repoUser, authService });
  return { chance, createUserHandler, repoUser };
};
