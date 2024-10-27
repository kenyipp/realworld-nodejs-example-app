import { compare, hash } from 'bcryptjs';

import {
  PasswordNotMatchError,
  PasswordRequirementsNotMetError
} from '../../errors';
import {
  ComparePasswordInput,
  ComparePasswordOutput,
  EncryptPasswordInput,
  EncryptPasswordOutput,
  ValidatePasswordInput,
  ValidatePasswordOutput
} from './types';

export class PasswordHandler {
  async encryptPassword({ password }: EncryptPasswordInput): EncryptPasswordOutput {
    this.validatePassword({ password });
    const hashed = await hash(password, 10);
    return hashed;
  }

  async comparePassword({
    password,
    encryptedPassword
  }: ComparePasswordInput): ComparePasswordOutput {
    const matched = await compare(password, encryptedPassword);
    if (!matched) {
      throw new PasswordNotMatchError();
    }
  }

  private validatePassword({
    password
  }: ValidatePasswordInput): ValidatePasswordOutput {
    const details: string[] = [];
    if (password.length < 6) {
      details.push('The password must be at least 6 characters long');
    }
    // Regular expression to match passwords with at least one letter and one digit
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
    if (!passwordRegex.test(password)) {
      details.push('The password must contain at least one letter and one digit');
    }
    if (details.length > 0) {
      throw new PasswordRequirementsNotMetError({ details });
    }
  }
}
