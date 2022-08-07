import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import {LOGIN} from '../../../api.endpoints';
import {environment} from '../../../../../environments/environment';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === HttpStatusCode.Unauthorized && request.url !== `${environment.API_HOST}${LOGIN}`) {
        this.authenticationService.logout();
        location.reload();
      }

      return throwError(err);
    }));
  }
}
