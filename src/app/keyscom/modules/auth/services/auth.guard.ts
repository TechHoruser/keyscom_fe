import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from './authentication.service';

const STORAGE_LAST_URL = 'lastUrl';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean
  {
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser) {
      return true;
    }

    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
    return false;
  }

  getLastUrl(): string
  {
    return localStorage.getItem(STORAGE_LAST_URL) ?? '/dashboard';
  }

  setLastUrl(url: string): void
  {
    localStorage.setItem(STORAGE_LAST_URL, url);
  }

  goToLastUrl(): void
  {
    this.router.navigate([this.getLastUrl()]);
  }
}
