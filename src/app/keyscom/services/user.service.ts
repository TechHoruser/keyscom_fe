import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {User} from '../../shared/auth/user.model';
import {USER_LIST} from '../api.endpoints';
import {PaginationModel} from '../models/pagination.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PaginationModel<User>> {
    return this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`);
  }
}
