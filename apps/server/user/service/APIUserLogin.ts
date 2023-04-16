import { isNil } from "lodash";
import type { UserService, AuthService } from "@conduit/core/service";
import { PasswordNotMatchError } from "@conduit/core/service/auth/error";
import {
	APIErrorUnauthorized,
	APIErrorForbidden,
	APIErrorNotFound,
	APIErrorInternalServerError
} from "@conduit/utils";
import { UserStatus } from "@conduit/types";
import {
	DtoUser,
	type DtoInputLogin
} from "../dto";

export class APIUserLogin {

	private authService: AuthService;
	private userService: UserService;

	constructor({ authService, userService }: APIUserLoginConstructor) {
		this.authService = authService;
		this.userService = userService;
	}

	async execute({ input }: APIUserLoginInput): Promise<UserLoginOutput> {
		const { email, password } = input;
		const user = await this.userService.getUserByEmail({ email });

		APIErrorNotFound.assert({
			condition: !isNil(user),
			message: "We couldn't find your account. Please check your login information or create a new account."
		});

		APIErrorForbidden.assert({
			condition: user.statusId !== UserStatus.Banned,
			message: "Sorry, your account has been banned. Please contact support for more information."
		});

		try {
			this.authService.comparePassword({ password, encryptedPassword: user.hash });
		} catch (error) {
			if (error instanceof PasswordNotMatchError) {
				throw new APIErrorUnauthorized({
					message: "Sorry, the password you entered is incorrect. Please double-check your password and try again.",
					cause: error
				});
			}
			throw new APIErrorInternalServerError({});
		}

		const dtoUser = new DtoUser({ dbDtoUser: user });
		return { user: dtoUser };
	}

}

interface APIUserLoginConstructor {
	authService: AuthService;
	userService: UserService;
}

interface APIUserLoginInput {
	input: DtoInputLogin;
}

interface UserLoginOutput {
	user: DtoUser;
}
