import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {AlertService} from '../../layout/services/alert.service';
import {LOGIN} from '../../../api.endpoints';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private http: HttpClient,
    private alertService: AlertService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User
  {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User>
  {
    return this.http.post<any>(`${environment.API_HOST}${LOGIN}`, { username, password })
      .pipe(
        catchError(() => {
          this.alertService.error($localize`Incorrect email or password`);
          return of();
        }),
        map(response => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          const user = (new JwtHelperService()).decodeToken(response.token);
          user.token = response.token;
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          return user;
        }),
      );
  }

  logout(): void
  {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
