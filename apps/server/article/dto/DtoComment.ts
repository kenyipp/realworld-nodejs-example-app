import { DbDtoArticleComment, DbDtoUser } from "@conduit/core/database/dto";

import { DtoProfile } from "../../user/dto/DtoProfile";

export class DtoComment {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	body: string;
	author: DtoProfile;

	constructor({ comment, author, following }: DtoCommentConstructor) {
		this.author = new DtoProfile({ dbDtoUser: author, following });
		this.id = comment.id;
		this.createdAt = new Date(comment.createdAt);
		this.updatedAt = new Date(comment.updatedAt);
		this.body = comment.body;
	}
}

interface DtoCommentConstructor {
	comment: DbDtoArticleComment;
	author: DbDtoUser;
	following: boolean;
}
