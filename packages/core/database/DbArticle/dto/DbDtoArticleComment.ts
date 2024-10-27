import { RecordStatus } from '@conduit/core/types';

export class DbDtoArticleComment {
  id: string;
  body: string;
  author: {
    id: string;
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };

  recordStatus: RecordStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    body,
    userId,
    userName,
    userBio,
    userImage,
    isFollowing,
    recordStatus,
    createdAt,
    updatedAt
  }: DbDtoArticleCommentConstructor) {
    this.id = id;
    this.body = body;
    this.author = {
      id: userId,
      username: userName,
      bio: userBio,
      image: userImage,
      following: isFollowing
    };
    this.recordStatus = recordStatus;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface DbDtoArticleCommentConstructor {
  id: string;
  body: string;
  userId: string;
  userName: string;
  userBio?: string;
  userImage?: string;
  isFollowing: boolean;
  recordStatus: RecordStatus;
  createdAt: Date;
  updatedAt: Date;
}
