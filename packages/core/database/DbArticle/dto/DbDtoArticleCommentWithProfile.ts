import { DbDtoProfile } from '@conduit/core/database';

export class DbDtoArticleCommentWithProfile {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: DbDtoProfile;

  constructor({
    id,
    createdAt,
    updatedAt,
    body,
    author
  }: DbDtoArticleCommentWithProfileConstructor) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.body = body;
    this.author = new DbDtoProfile(author);
  }
}

interface DbDtoArticleCommentWithProfileConstructor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: {
    id: string;
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}
