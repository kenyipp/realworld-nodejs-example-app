import assert from 'assert';
import Chance from 'chance';
import supertest from 'supertest';

import { ServiceFactory, dangerouslyResetDb } from '@conduit/core';

import { app } from '../../app';

const request = supertest(app);

describe('GET /api/profiles/:username', () => {
  it('should be able to get the user profile', async () => {
    const { userB, accessTokenA } = await setup();
    const response = await request
      .get(`/api/profiles/${userB.username}`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.profile).toBeDefined();
    const { profile } = response.body;
    expect(profile.username).toBe(userB.username);
    expect(profile.bio).toBe(userB.bio);
    expect(profile.image).toBe(userB.image);
  });

  it('should return a status code of 404 - Not Found if the targeted user does not exist', async () => {
    const { accessTokenA } = await setup();
    const response = await request
      .get('/api/profiles/UN_EXIST_USERNAME')
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(404);
  });

  it('should return a profile with the following attribute with a value of true if the requested user is following the targeted user', async () => {
    const { userService, userA, userB, accessTokenA } = await setup();
    await userService.followUser({
      followerId: userA.id,
      followingUsername: userB.username
    });
    const response = await request
      .get(`/api/profiles/${userB.username}`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.profile).toBeDefined();
    const { profile } = response.body;
    expect(profile.username).toBe(userB.username);

    expect(profile.bio).toBe(userB.bio);
    expect(profile.image).toBe(userB.image);
    expect(profile.following).toBe(true);
  });

  it('should return a profile with the following attribute with a value of false if the requested user is not following the targeted user', async () => {
    const { userB, accessTokenA } = await setup();
    const response = await request
      .get(`/api/profiles/${userB.username}`)
      .set('Authorization', `Bearer ${accessTokenA}`)
      .send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.profile).toBeDefined();
    const { profile } = response.body;
    expect(profile.username).toBe(userB.username);

    expect(profile.bio).toBe(userB.bio);
    expect(profile.image).toBe(userB.image);
    expect(profile.following).toBe(false);
  });

  it('should return a profile with the following attribute with a value of false if the client does not provide a valid auth token', async () => {
    const { userB } = await setup();
    const response = await request.get(`/api/profiles/${userB.username}`).send();
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body.profile).toBeDefined();
    const { profile } = response.body;
    expect(profile.username).toBe(userB.username);

    expect(profile.bio).toBe(userB.bio);
    expect(profile.image).toBe(userB.image);
    expect(profile.following).toBe(false);
  });

  it('should return a status code of 401 - Unauthorized if the client provides an invalid auth header', async () => {
    const { userB, accessTokenA } = await setup();
    const response = await request
      .get(`/api/profiles/${userB.username}`)
      .set('Authorization', `Bearer ${accessTokenA}+InvalidToken`)
      .send();
    expect(response.status).toBe(401);
  });

  beforeEach(() => dangerouslyResetDb());
});

const setup = async () => {
  const chance = new Chance();
  const factory = new ServiceFactory();
  const userService = factory.newUserService();
  const authService = factory.newAuthService();

  const userAId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userA = await userService.getUserById({ id: userAId });
  assert(userA);
  const accessTokenA = authService.generateAccessToken({
    userId: userAId,
    loginId: chance.guid()
  });

  const userBId = await userService.createUser({
    email: chance.email(),
    password: 'Abcd1234',
    username: chance.word()
  });
  const userB = await userService.getUserById({ id: userBId });
  assert(userB);
  const accessTokenB = authService.generateAccessToken({
    userId: userBId,
    loginId: chance.guid()
  });

  return {
    userService,
    userA,
    userB,
    accessTokenA,
    accessTokenB
  };
};
