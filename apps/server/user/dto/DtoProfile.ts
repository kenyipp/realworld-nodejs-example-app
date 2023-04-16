import { type DbDtoUser } from "@conduit/core/database/dto";

export class DtoProfile {

	username: string;
	email: string;
	bio?: string;
	image?: string;
	following: boolean;

	constructor({ dbDtoUser, following }: DtoProfileConstructor) {
		this.username = dbDtoUser.username;
		this.email = dbDtoUser.email;
		this.bio = dbDtoUser.bio;
		this.image = dbDtoUser.image;
		this.following = following;
	}

}

interface DtoProfileConstructor {
	dbDtoUser: DbDtoUser;
	following: boolean;
}
