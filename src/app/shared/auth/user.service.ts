import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {User} from './user.model';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  login(user: any): Observable<any> {
    return this.http.post(`${environment.API_HOST}/login_check`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.API_HOST}/users`);
  }
}
