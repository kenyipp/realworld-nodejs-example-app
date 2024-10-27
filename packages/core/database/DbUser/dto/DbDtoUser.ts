import { UserStatus } from '@conduit/core/types';

export class DbDtoUser {
  id: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  hash: string;
  recordStatus: UserStatus;
  createdAt: Date;
  updatedAt: Date;

  constructor({
    id,
    username,
    email,
    bio,
    image,
    hash,
    recordStatus,
    createdAt,
    updatedAt
  }: DbDtoUserConstructor) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.bio = bio;
    this.image = image;
    this.hash = hash;
    this.recordStatus = recordStatus;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

interface DbDtoUserConstructor {
  id: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  hash: string;
  recordStatus: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
