import assert from 'assert';
import { Chance } from 'chance';

import {
  PasswordNotMatchError,
  PasswordRequirementsNotMetError
} from '@conduit/core/service';
import { PasswordHandler } from '@conduit/core/service/auth/implementations';

describe('Auth - Password', () => {
  it("should throw an error if the password's length is less than 6", async () => {
    const { passwordHandler } = await setup();
    try {
      await passwordHandler.encryptPassword({ password: 'abc12' });
      assert.fail();
    } catch (error) {
      expect(error).toBeInstanceOf(PasswordRequirementsNotMetError);
      if (error instanceof PasswordRequirementsNotMetError) {
        expect(error.details).toHaveLength(1);
      }
    }
  });

  it("should throw an error if the password doesn't contain at least one digit or letter", async () => {
    const { passwordHandler } = await setup();
    try {
      await passwordHandler.encryptPassword({ password: 'abcdef' });
      assert.fail();
    } catch (error) {
      expect(error).toBeInstanceOf(PasswordRequirementsNotMetError);
      if (error instanceof PasswordRequirementsNotMetError) {
        expect(error.details).toHaveLength(1);
      }
    }
  });

  it("should throw an error if the length of the password is less than 6 characters and it doesn't contain at least one digit or letter", async () => {
    const { passwordHandler } = await setup();
    try {
      await passwordHandler.encryptPassword({ password: 'abcde' });
      assert.fail();
    } catch (error) {
      expect(error).toBeInstanceOf(PasswordRequirementsNotMetError);
      if (error instanceof PasswordRequirementsNotMetError) {
        expect(error.details).toHaveLength(2);
      }
    }
  });

  it('should be able to encrypt a password securely', async () => {
    const { passwordHandler } = await setup();
    const hash = await passwordHandler.encryptPassword({ password: '123abc' });
    expect(hash).toBeDefined();
  });

  it('should be able to encrypt and then verify a password', async () => {
    const { passwordHandler } = await setup();
    const password = '123abc';
    const hash = await passwordHandler.encryptPassword({ password });
    expect(hash).toBeDefined();
    await passwordHandler.comparePassword({ password, encryptedPassword: hash });
  });

  it('should throw an error if the password is incorrect', async () => {
    const { passwordHandler } = await setup();
    const password = '123abc';
    const hash = await passwordHandler.encryptPassword({ password });
    expect(hash).toBeDefined();
    try {
      await passwordHandler.comparePassword({ password, encryptedPassword: hash });
    } catch (error) {
      expect(error).toBeInstanceOf(PasswordNotMatchError);
    }
  });
});

const setup = async () => {
  const chance = new Chance();
  const passwordHandler = new PasswordHandler();
  return { chance, passwordHandler };
};
