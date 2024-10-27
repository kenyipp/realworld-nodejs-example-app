import jsonwebtoken, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

import { config } from '@conduit/utils';

import { InvalidTokenError } from '../../errors';
import {
  GenerateAccessTokenInput,
  GenerateAccessTokenOutput,
  GenerateRefreshTokenInput,
  GenerateRefreshTokenOutput,
  JwtPayload,
  RefreshTokenPayload,
  VerifyAccessTokenInput,
  VerifyAccessTokenOutput,
  VerifyRefreshTokenInput,
  VerifyRefreshTokenOutput
} from './types';

export class AccessTokenHandler {
  private static version = '1.0';

  verifyAccessToken({
    accessToken
  }: VerifyAccessTokenInput): VerifyAccessTokenOutput {
    try {
      const payload = jsonwebtoken.verify(
        accessToken,
        config.auth.jwtSecret
      ) as JwtPayload;
      return payload.userId;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new InvalidTokenError({
          message: 'Your session has expired. Please log in again.',
          cause: error
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenError({ cause: error });
      }
      throw error;
    }
  }

  verifyRefreshToken({
    refreshToken
  }: VerifyRefreshTokenInput): VerifyRefreshTokenOutput {
    try {
      const payload = jsonwebtoken.verify(
        refreshToken,
        config.auth.jwtSecret
      ) as RefreshTokenPayload;
      return payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new InvalidTokenError({
          message: 'Your session has expired. Please log in again.',
          cause: error
        });
      }
      if (error instanceof JsonWebTokenError) {
        throw new InvalidTokenError({ cause: error });
      }
      throw error;
    }
  }

  generateAccessToken({
    userId,
    loginId
  }: GenerateAccessTokenInput): GenerateAccessTokenOutput {
    const payload: JwtPayload = {
      userId,
      iss: 'Conduit',
      sub: userId,
      jti: loginId,
      version: AccessTokenHandler.version
    };
    if (config.domain) {
      payload.aud = `https://${config.domain}`;
    }
    const accessToken = jsonwebtoken.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.expiresIn
    });
    return accessToken;
  }

  generateRefreshToken({
    userId,
    loginId
  }: GenerateRefreshTokenInput): GenerateRefreshTokenOutput {
    const payload: RefreshTokenPayload = {
      userId,
      loginId,
      version: AccessTokenHandler.version
    };
    const refreshToken = jsonwebtoken.sign(payload, config.auth.jwtSecret, {
      expiresIn: config.auth.expiresIn
    });
    return refreshToken;
  }
}
