import { DbDtoUser } from "@conduit/core/database/dto";

import { signJsonWebToken } from "../../utils";

export class DtoUser {
	username: string;
	email: string;
	bio?: string;
	image?: string;
	token?: string;

	constructor({ dbDtoUser }: DtoUserConstructor) {
		this.username = dbDtoUser.username;
		this.email = dbDtoUser.email;
		this.bio = dbDtoUser.bio;
		this.image = dbDtoUser.image;
		this.token = this.getAccessToken({ dbDtoUser });
	}

	private getAccessToken({ dbDtoUser }: { dbDtoUser: DbDtoUser }): string {
		const token = signJsonWebToken({ dbDtoUser }).accessToken;
		return token;
	}
}

interface DtoUserConstructor {
	dbDtoUser: DbDtoUser;
}
