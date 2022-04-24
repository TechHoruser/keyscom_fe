import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {USER_CREATE, USER_LIST} from '../../../api.endpoints';
import {CreateUserEntity} from '../shared/create-user.entity';

@Injectable({ providedIn: 'root' })
export class UserService {
  public users: BehaviorSubject<User[]>;

  constructor(
    private http: HttpClient,
  ) {
    this.users = new BehaviorSubject([]);
  }

  updateUsers(): void {
    this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`)
      .subscribe((res) => this.users.next(res.results));
  }

  createUser(user: CreateUserEntity): Observable<any>
  {
    return this.http.post<User>(`${environment.API_HOST}${USER_CREATE}`, user);
  }
}
