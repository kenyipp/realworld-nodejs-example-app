import { Factory as ServiceFactory } from "@conduit/core/Factory";
import { AuthService, UserService } from "@conduit/core/service";

import {
	APIFollowUser,
	APIGetCurrentUser,
	APIGetProfile,
	APIRegistration,
	APIUnfollowUser,
	APIUpdateUser,
	APIUserLogin
} from ".";

export class Factory {
	private authService: AuthService;
	private userService: UserService;

	constructor() {
		const factory = new ServiceFactory();
		this.authService = factory.newAuthService();
		this.userService = factory.newUserService();
	}

	newAPIFollowUser(): APIFollowUser {
		return new APIFollowUser({ userService: this.userService });
	}

	newAPIUnfollowUser(): APIUnfollowUser {
		return new APIUnfollowUser({ userService: this.userService });
	}

	newAPIGetCurrentUser(): APIGetCurrentUser {
		return new APIGetCurrentUser();
	}

	newAPIUpdateUser(): APIUpdateUser {
		return new APIUpdateUser({ userService: this.userService });
	}

	newAPIGetProfile(): APIGetProfile {
		return new APIGetProfile({ userService: this.userService });
	}

	newAPIRegistration(): APIRegistration {
		return new APIRegistration({ userService: this.userService });
	}

	newAPIUserLogin(): APIUserLogin {
		return new APIUserLogin({
			authService: this.authService,
			userService: this.userService
		});
	}
}
