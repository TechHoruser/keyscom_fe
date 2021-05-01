import { Injectable } from '@angular/core';
import {UserInfo} from '../models/user-info.model';
import {AuthService} from '@auth0/auth0-angular';
import {AppConfigService} from '../../shared/services/app-config.service';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {
  constructor(
    private authService: AuthService,
    private appConfigService: AppConfigService
  ) { }

  public async getUserInfo(): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
      this.authService.user$.subscribe(user => {
        const userInfo = new UserInfo(
          user['name'],
          user['email'],
          user['picture'],
          user[this.appConfigService.auth0ExtraDataNamespace + 'app_metadata'],
          true
        );

        return resolve(userInfo);
      });
    });
  }
}
