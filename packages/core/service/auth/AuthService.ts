import {
  AccessTokenHandler,
  ComparePasswordInput,
  ComparePasswordOutput,
  EncryptPasswordInput,
  EncryptPasswordOutput,
  GenerateAccessTokenInput,
  GenerateAccessTokenOutput,
  PasswordHandler,
  VerifyAccessTokenInput,
  VerifyAccessTokenOutput
} from './implementations';

export class AuthService {
  private passwordHandler: PasswordHandler;
  private accessTokenHandler: AccessTokenHandler;

  constructor() {
    this.passwordHandler = new PasswordHandler();
    this.accessTokenHandler = new AccessTokenHandler();
  }

  generateAccessToken(input: GenerateAccessTokenInput): GenerateAccessTokenOutput {
    return this.accessTokenHandler.generateAccessToken(input);
  }

  verifyAccessToken(input: VerifyAccessTokenInput): VerifyAccessTokenOutput {
    return this.accessTokenHandler.verifyAccessToken(input);
  }

  async encryptPassword(input: EncryptPasswordInput): EncryptPasswordOutput {
    return this.passwordHandler.encryptPassword(input);
  }

  async comparePassword(input: ComparePasswordInput): ComparePasswordOutput {
    await this.passwordHandler.comparePassword(input);
  }
}
