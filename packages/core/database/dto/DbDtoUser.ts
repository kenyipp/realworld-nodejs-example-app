import { UserStatus } from "@conduit/types";

export interface DbDtoUser {
	id: string;
	username: string;
	email: string;
	bio?: string;
	image?: string;
	hash: string;
	statusId: UserStatus;
	createdAt: Date;
	updatedAt: Date;
}
