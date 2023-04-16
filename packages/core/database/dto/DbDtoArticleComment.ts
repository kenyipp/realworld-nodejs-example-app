import { RecStatus } from "@conduit/types";

export interface DbDtoArticleComment {
	id: string;
	body: string;
	userId: string;
	recStatus: RecStatus;
	createdAt: Date;
	updatedAt: Date;
}
