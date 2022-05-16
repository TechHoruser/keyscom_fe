import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {USER, USER_UUID} from '../../../api.endpoints';
import {CreateUserEntity} from '../shared/create-user.entity';
import {ApiHelperService} from '../../shared/services/api-helper.service';
import {UpdateProfileEntity} from '../../profile/shared/update-profile.entity';
import {Client} from '../../../models/client.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  public users: BehaviorSubject<User[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: ApiHelperService,
  ) {
    this.users = new BehaviorSubject([]);
  }

  getUser(userUuid: string): Observable<User> {
    return this.http.get<User>(`${environment.API_HOST}${USER_UUID}`.replace(':userUuid', userUuid));
  }

  getUsers(filters?: object): Observable<PaginationModel<User>> {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    return this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER}`, options);
  }

  updateProfile(profile: UpdateProfileEntity): Observable<any> {
    return this.http.put<Client>(`${environment.API_HOST}${USER}`, profile);
  }

  updateUsers(filters?: object): void {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER}`, options)
      .subscribe((res) => this.users.next(res.results));
  }

  createUser(user: CreateUserEntity): Observable<any>
  {
    return this.http.post<User>(`${environment.API_HOST}${USER}`, user);
  }

  updateUser(userUuid: string, user: CreateUserEntity): Observable<any>
  {
    return this.http.put<User>(`${environment.API_HOST}${USER_UUID}`.replace(':userUuid', userUuid), user);
  }

  deleteByUuid(userUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${USER_UUID}`.replace(':userUuid', userUuid));
  }
}
