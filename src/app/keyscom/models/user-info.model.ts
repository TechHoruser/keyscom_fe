export class UserInfo {
  name: string;
  email: string;
  avatar: string;
  appMetadata: any;
  active: boolean;

  constructor(name: string, email: string, avatar: string, appMetadata: any, active: boolean) {
    this.name = name;
    this.email = email;
    this.avatar = avatar;
    this.appMetadata = appMetadata;
    this.active = active;
  }
}
