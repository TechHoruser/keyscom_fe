import {AfterContentChecked, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {faAngleLeft, faAngleRight, faChevronRight, faSignOut, faUser} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {LoaderService} from '../../services/loader.service';
import {User} from '../../../../models/user.model';
import {AuthenticationService} from '../../../auth/services/authentication.service';

const SIDENAV_IS_OPEN = 'keyscom-layout-sidenav-is-open';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, AfterContentChecked {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faUser = faUser;
  faChevronRight = faChevronRight;
  faSignOut = faSignOut;
  mobileQuery: MediaQueryList;
  user: User;
  opened: boolean;
  loading: boolean;
  private mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private loaderService: LoaderService,
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
  ) {}

  public ngOnInit(): void
  {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => this.changeDetectorRef.detectChanges();

    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this.mobileQueryListener);
    }

    this.loading = true;
    this.loaderService.loading.subscribe(next => this.loading = next);

    this.user = this.authService.currentUserValue;
    this.opened = JSON.parse(localStorage.getItem(SIDENAV_IS_OPEN)) ?? !this.mobileQuery.matches;
  }

  public ngAfterContentChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  toggle(): void
  {
    this.opened = !this.opened;
    localStorage.setItem(SIDENAV_IS_OPEN, String(this.opened));
    setTimeout(() => window.dispatchEvent(new Event('resize')), 200);
  }
}
