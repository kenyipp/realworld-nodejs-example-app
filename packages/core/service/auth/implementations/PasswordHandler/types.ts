/**
 *
 * function: encryptPassword
 *
 */
export interface EncryptPasswordInput {
  password: string;
}

export type EncryptPasswordOutput = Promise<string>;

/**
 *
 * function: comparePassword
 *
 */
export interface ComparePasswordInput {
  password: string;
  encryptedPassword: string;
}

export type ComparePasswordOutput = Promise<void>;

/**
 *
 * function: validatePassword
 *
 */
export interface ValidatePasswordInput {
  password: string;
}

export type ValidatePasswordOutput = void;
