import { Injectable } from '@angular/core';
import {AuthGuard} from '@auth0/auth0-angular';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export const STORAGE_LAST_URL = 'lastUrl';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService extends AuthGuard {

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return super.canActivate(next, state)
      .pipe(map(canActivate => {
        if (!canActivate) {
          localStorage.setItem(STORAGE_LAST_URL, state.url);
        }

        return canActivate;
      }));
  }

}
