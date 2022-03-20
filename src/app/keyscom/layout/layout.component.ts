import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {faAngleLeft, faAngleRight, faChevronRight, faSignOut, faUser} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';
import {APP_BASE_HREF} from '@angular/common';
import {AppConfigService} from '../../shared/services/app-config.service';
import {AuthenticationService} from '../../shared/auth/authentication.service';
import {User} from '../../shared/auth/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faUser = faUser;
  faChevronRight = faChevronRight;
  faSignOut = faSignOut;
  mobileQuery: MediaQueryList;
  user: User;
  private readonly mobileQueryListener: () => void;

  constructor(
    @Inject(APP_BASE_HREF) public baseHref: string,
    private router: Router,
    private authService: AuthenticationService,
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
    console.log('test');
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => this.user = user);
  }
}
