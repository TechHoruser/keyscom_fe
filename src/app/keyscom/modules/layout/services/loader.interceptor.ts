import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, tap, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {LoaderService} from './loader.service';

@Injectable({providedIn: 'root'})
export class LoaderInterceptor implements HttpInterceptor {
  constructor(
    private loaderService: LoaderService,
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
  {
    const loaderUuid = this.loaderService.showLoader();

    return next.handle(request)
      .pipe(
        tap(evt => {
          if (evt instanceof HttpResponse) {
            this.loaderService.hideLoader(loaderUuid);
          }
        }),
        catchError(err => {
          this.loaderService.hideLoader(loaderUuid);
          return throwError(err);
        }),
      );
  }
}
