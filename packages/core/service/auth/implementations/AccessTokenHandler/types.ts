export interface JwtPayload {
  userId: string;
  aud?: string;
  iss: string;
  sub: string;
  jti: string;
  version?: string;
}

export interface RefreshTokenPayload {
  userId: string;
  loginId: string;
  version?: string;
}

/**
 *
 * function: generateAccessToken
 *
 */
export interface GenerateAccessTokenInput {
  userId: string;
  loginId: string;
}

export type GenerateAccessTokenOutput = string;

/**
 *
 * function: generateRefreshToken
 *
 */
export interface GenerateRefreshTokenInput {
  userId: string;
  loginId: string;
}

export type GenerateRefreshTokenOutput = string;

/**
 *
 * function: verifyAccessToken
 *
 */
export interface VerifyAccessTokenInput {
  accessToken: string;
}

export type VerifyAccessTokenOutput = string;

/**
 *
 * function: verifyRefreshToken
 *
 */
export interface VerifyRefreshTokenInput {
  refreshToken: string;
}

export type VerifyRefreshTokenOutput = RefreshTokenPayload;
