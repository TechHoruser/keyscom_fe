import {HttpBackend, HttpClient} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig: any;
  private http: HttpClient;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    handler: HttpBackend
  ) {
    this.http = new HttpClient(handler);
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
}
