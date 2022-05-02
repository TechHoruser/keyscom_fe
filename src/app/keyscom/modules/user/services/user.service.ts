import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {USER_CREATE, USER_DELETE, USER_LIST} from '../../../api.endpoints';
import {CreateUserEntity} from '../shared/create-user.entity';
import {ApiHelperService} from '../../shared/services/api-helper.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  public users: BehaviorSubject<User[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: ApiHelperService,
  ) {
    this.users = new BehaviorSubject([]);
  }

  updateUsers(filters?: object): void {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`, options)
      .subscribe((res) => this.users.next(res.results));
  }

  createUser(user: CreateUserEntity): Observable<any>
  {
    return this.http.post<User>(`${environment.API_HOST}${USER_CREATE}`, user);
  }

  deleteByUuid(userUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${USER_DELETE}`.replace(':userUuid', userUuid));
  }
}
