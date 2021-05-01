import {HttpBackend, HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AuthClientConfig, AuthConfig} from '@auth0/auth0-angular';
import {APP_BASE_HREF} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;
  private http: HttpClient;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private authClientConfig: AuthClientConfig,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
  }

  loadAppConfig(): Promise<any> {
    return this.http.get(this.baseHref.slice(0, -1) + '/assets/app-config.json')
      .toPromise()
      .then(data => {
        this.appConfig = data;
        this.authClientConfig.set(
          {
            ...{
              ...this.authConfig,
              redirectUri: window.location.origin + this.baseHref.slice(0, -1) + '/callback'
            },
            httpInterceptor: {
              allowedList: [
                this.apiHost + '/api/*'
              ]
            }
          }
        );
      });
  }

  get apiHost(): string {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    return window.location.protocol + '//' +
      window.location.hostname + ':' +
      (this.appConfig.apiPort ?? window.location.port) +
      (this.appConfig.apiRootPath ?? '');
  }

  get authConfig(): AuthConfig {

    if (!this.appConfig) {
      throw Error('Config file not loaded!');
    }

    this.appConfig.authConfig['redirectUri'] = window.location.origin + '/callback';

    return this.appConfig.authConfig;
  }

  get auth0ExtraDataNamespace(): string {
    return 'auth0ExtraDataNamespace' in this.appConfig ? this.appConfig.auth0ExtraDataNamespace : '';
  }
}
