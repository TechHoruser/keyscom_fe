import {ChangeDetectorRef, Component} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {faAngleLeft, faAngleRight, faChevronRight, faSignOut, faUser} from '@fortawesome/free-solid-svg-icons';
import {Router} from '@angular/router';
import {LoaderService} from '../services/loader.service';
import {AuthenticationService} from '../../shared/auth/authentication.service';
import {User} from '../../shared/auth/user.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
  faAngleRight = faAngleRight;
  faAngleLeft = faAngleLeft;
  faUser = faUser;
  faChevronRight = faChevronRight;
  faSignOut = faSignOut;
  mobileQuery: MediaQueryList;
  user: User;
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
}
