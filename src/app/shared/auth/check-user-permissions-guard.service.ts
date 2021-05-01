import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot} from '@angular/router';
import {UserPermissionsService} from './user-permissions.service';

@Injectable({
  providedIn: 'root'
})
export class CheckUserPermissionsGuardService implements CanActivateChild {

  constructor(
    private userPermissionsService: UserPermissionsService,
    private router: Router
  ) {
  }

  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      if (childRoute.data.permission) {
        const hasPermission = await this.userPermissionsService.hasPermission([childRoute.data.permission]);
        if (!hasPermission) {
          const currentUrl = this.router.url;
          this.router.navigate([currentUrl]);
        }
        return resolve(hasPermission);
      } else {
        return resolve(true);
      }
    });
  }

}
