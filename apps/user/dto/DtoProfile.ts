export class DtoProfile {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;

  constructor({ username, bio, image, following }: DtoProfileConstructor) {
    this.username = username;
    this.bio = bio;
    this.image = image;
    this.following = following;
  }
}

interface DtoProfileConstructor {
  username: string;
  bio?: string;
  image?: string;
  following: boolean;
}
