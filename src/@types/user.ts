export class User {
  isLoggedIn: boolean;
  token?: UserTokenInterface;
  user?: UserDataInterface;

  constructor() {
    this.isLoggedIn = false;
  }
}

interface UserTokenInterface {
  accessToken: string;
  expireDate: number;
  refreshToken: string;
}

interface UserDataInterface {
  email: string;
}
