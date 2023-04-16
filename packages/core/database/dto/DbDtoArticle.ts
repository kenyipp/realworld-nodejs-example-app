import { RecStatus } from "@conduit/types";

export interface DbDtoArticle {
	id: string;
	title: string;
	slug: string;
	description: string;
	body: string;
	userId: string;
	statusId: RecStatus;
	createdAt: Date;
	updatedAt: Date;
}
