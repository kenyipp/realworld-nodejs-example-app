import type {
	DbDtoArticle,
	DbDtoUser,
	DbDtoArticleMeta,
	DbDtoArticleTag
} from "@conduit/core/database/dto";
import { DtoProfile } from "../../user/dto";

export class DtoArticle {

	slug: string;
	title: string;
	description: string;
	body: string;
	createdAt: Date;
	updatedAt: Date;
	favorited: boolean;
	favoritesCount: number;
	author: DtoProfile;
	tagList: string[];

	constructor({
		article, author, meta, tag
	}: DtoArticleConstructor) {
		this.author = new DtoProfile({ dbDtoUser: author, following: meta.following });
		this.favorited = meta.favorited;
		this.favoritesCount = meta.favoritesCount;
		this.tagList = tag.tags;
		this.slug = article.slug;
		this.title = article.title;
		this.description = article.description;
		this.body = article.body;
		this.createdAt = article.createdAt;
		this.updatedAt = article.updatedAt;
	}

}

interface DtoArticleConstructor {
	article: DbDtoArticle;
	author: DbDtoUser;
	meta: DbDtoArticleMeta;
	tag: DbDtoArticleTag;
}
