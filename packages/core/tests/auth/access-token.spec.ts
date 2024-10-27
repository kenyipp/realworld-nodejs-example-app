import assert from 'assert';
import { Chance } from 'chance';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import * as sinon from 'sinon';

import { InvalidTokenError } from '@conduit/core/service';
import { AccessTokenHandler } from '@conduit/core/service/auth/implementations';

describe('Auth Service - Access Token', () => {
  describe('Generate Access Token', () => {
    it('should able be to generate a valid access token', async () => {
      const { accessTokenHandler, chance } = await setup();
      const userId = chance.guid();
      const loginId = chance.guid();

      const accessToken = accessTokenHandler.generateAccessToken({
        userId,
        loginId
      });
      expect(accessToken).toBeDefined();

      const response = jsonwebtoken.decode(accessToken);
      expect(response).toBeDefined();

      const payload = response as any;
      expect(payload.userId).toBe(userId);
      expect(payload.jti).toBe(loginId);
    });
  });

  describe('Verify Access Token', () => {
    it('should be able to verify a valid access token', async () => {
      const { accessTokenHandler, chance } = await setup();
      const userId = chance.guid();
      const loginId = chance.guid();

      const accessToken = accessTokenHandler.generateAccessToken({
        userId,
        loginId
      });
      expect(accessToken).toBeDefined();

      const response = accessTokenHandler.verifyAccessToken({ accessToken });
      expect(response).toBe(userId);
    });

    it('should throw an error if the access token is invalid', async () => {
      const { accessTokenHandler, chance } = await setup();
      const accessToken = chance.string();

      try {
        accessTokenHandler.verifyAccessToken({ accessToken });
        assert.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidTokenError);
      }
    });

    it('should throw an error if the access token has expired', async () => {
      const { accessTokenHandler, chance } = await setup();
      const userId = chance.guid();
      const loginId = chance.guid();

      const accessToken = accessTokenHandler.generateAccessToken({
        userId,
        loginId
      });
      expect(accessToken).toBeDefined();

      sinon.useFakeTimers(moment().add(1, 'month').toDate());

      try {
        accessTokenHandler.verifyAccessToken({ accessToken });
        assert.fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidTokenError);
      }
    });
  });

  describe('Generate Refresh Token', () => {
    it('should be able to generate a valid refresh token', async () => {
      const { accessTokenHandler, chance } = await setup();
      const userId = chance.guid();
      const loginId = chance.guid();

      const refreshToken = accessTokenHandler.generateRefreshToken({
        userId,
        loginId
      });
      expect(refreshToken).toBeDefined();

      const response = jsonwebtoken.decode(refreshToken);
      expect(response).toBeDefined();

      const payload = response as any;
      expect(payload.userId).toBe(userId);
      expect(payload.loginId).toBe(loginId);
    });
  });

  describe('Verify Refresh Token', () => {
    it('should be able to verify a valid refresh token', async () => {
      const { accessTokenHandler, chance } = await setup();
      const userId = chance.guid();
      const loginId = chance.guid();

      const refreshToken = accessTokenHandler.generateRefreshToken({
        userId,
        loginId
      });
      expect(refreshToken).toBeDefined();

      const response = accessTokenHandler.verifyRefreshToken({ refreshToken });
      expect(response).toBeDefined();
      expect(response.userId).toBe(userId);
      expect(response.loginId).toBe(loginId);
    });
  });

  afterEach(() => {
    sinon.restore();
  });
});

const setup = async () => {
  const chance = new Chance();
  const accessTokenHandler = new AccessTokenHandler();
  return { chance, accessTokenHandler };
};
