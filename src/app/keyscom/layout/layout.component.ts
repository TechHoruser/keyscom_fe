import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {AuthService} from '@auth0/auth0-angular';
import {MediaMatcher} from '@angular/cdk/layout';
import {faAngleLeft, faAngleRight, faChevronRight, faUser} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {UserInfoService} from '../services/user-info.service';
import {UserInfo} from '../models/user-info.model';
import {LoaderService} from '../services/loader.service';
import {APP_BASE_HREF} from '@angular/common';
import {AppConfigService} from '../../shared/services/app-config.service';

@Component({
  selector: 'app-app-layout',
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class LayoutComponent implements OnInit {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faUser = faUser;
  faChevronRight = faChevronRight;
  mobileQuery: MediaQueryList;
  userInfo: UserInfo;
  private readonly mobileQueryListener: () => void;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private router: Router,
    private authService: AuthService,
    private userInfoService: UserInfoService,
    public loaderService: LoaderService,
    changeDetectorRef: ChangeDetectorRef,
    public appConfig: AppConfigService,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this.mobileQueryListener);
    }
  }

  ngOnInit(): void {
    this.onInitLoad();
  }

  private async onInitLoad(): Promise<void> {
    this.userInfo = await this.userInfoService.getUserInfo();
  }

  toHome(): void {
    this.router.navigate(['/']);
  }

}
