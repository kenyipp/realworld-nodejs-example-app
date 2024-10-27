export class DtoArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };

  constructor({
    slug,
    title,
    description,
    body,
    tagList,
    createdAt,
    updatedAt,
    favorited,
    favoritesCount,
    author
  }: DtoArticleConstructor) {
    this.slug = slug;
    this.title = title;
    this.description = description;
    this.body = body;
    this.tagList = tagList;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.favorited = favorited;
    this.favoritesCount = favoritesCount;
    this.author = {
      username: author.username,
      bio: author.bio,
      image: author.image,
      following: author.following
    };
  }
}

interface DtoArticleConstructor {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: Date;
  updatedAt: Date;
  favorited: boolean;
  favoritesCount: number;
  author: {
    username: string;
    bio?: string;
    image?: string;
    following: boolean;
  };
}
