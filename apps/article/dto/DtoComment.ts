export class DtoComment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };

  constructor({ id, createdAt, updatedAt, body, author }: DtoCommentConstructor) {
    this.id = id;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.body = body;
    this.author = {
      username: author.username,
      bio: author.bio,
      image: author.image,
      following: author.following
    };
  }
}

interface DtoCommentConstructor {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}
