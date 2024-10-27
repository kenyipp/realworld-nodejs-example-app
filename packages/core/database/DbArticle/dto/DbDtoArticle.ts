import { DbDtoProfile } from '@conduit/core/database';
import { RecordStatus } from '@conduit/core/types';

export class DbDtoArticle {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  userId: string;
  recordStatus: RecordStatus;
  createdAt: Date;
  favoritesCount: number;
  favorited: boolean;
  updatedAt: Date;
  author: DbDtoProfile;

  constructor({
    id,
    title,
    slug,
    description,
    body,
    userId,
    recordStatus,
    favoritesCount,
    favorited,
    createdAt,
    updatedAt,
    author
  }: DbDtoArticleConstructor) {
    this.id = id;
    this.title = title;
    this.slug = slug;
    this.description = description;
    this.body = body;
    this.userId = userId;
    this.recordStatus = recordStatus;
    this.favoritesCount = favoritesCount;
    this.favorited = favorited || false;
    this.author = new DbDtoProfile({
      id: author.id,
      username: author.username,
      bio: author.bio,
      image: author.image,
      following: author.following
    });
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface DbDtoArticleConstructor {
  id: string;
  title: string;
  slug: string;
  description: string;
  body: string;
  userId: string;
  recordStatus: RecordStatus;
  favoritesCount: number;
  favorited?: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}
