export class DtoUser {
  username: string;
  email: string;
  bio?: string;
  image?: string;
  token?: string;

  constructor({ username, email, bio, image, token }: DtoUserConstructor) {
    this.username = username;
    this.email = email;
    this.bio = bio;
    this.image = image;
    this.token = token;
  }
}

interface DtoUserConstructor {
  username: string;
  email: string;
  bio?: string;
  image?: string;
  token?: string;
}
