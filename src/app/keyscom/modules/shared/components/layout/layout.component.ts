import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
export class LayoutComponent implements OnInit {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faUser = faUser;
  faChevronRight = faChevronRight;
  faSignOut = faSignOut;
  mobileQuery: MediaQueryList;
  user: User;
  opened: boolean;
  private readonly mobileQueryListener: () => void;

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    public loaderService: LoaderService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    if (this.mobileQuery.addEventListener) {
      this.mobileQuery.addEventListener('change', this.mobileQueryListener);
    } else {
      this.mobileQuery.addListener(this.mobileQueryListener);
    }

    this.user = this.authService.currentUserValue;
  }

  public ngOnInit(): void
  {
    this.opened = JSON.parse(localStorage.getItem(SIDENAV_IS_OPEN)) ?? !this.mobileQuery.matches;
  }

  toggle(): void
  {
    this.opened = !this.opened;
    localStorage.setItem(SIDENAV_IS_OPEN, String(this.opened));
  }
}
