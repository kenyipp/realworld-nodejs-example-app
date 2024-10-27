export class DbDtoProfile {
  id: string;
  username: string;
  bio?: string;
  image?: string;
  following: boolean;

  constructor({ id, username, bio, image, following }: DbDtoProfileConstructor) {
    this.id = id;
    this.username = username;
    this.bio = bio;
    this.image = image;
    this.following = typeof following === 'number' ? following > 0 : following;
  }
}

export interface DbDtoProfileConstructor {
  id: string;
  username: string;
  bio?: string;
  image?: string;
  following: boolean | number;
}
