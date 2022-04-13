import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {USER_LIST} from '../../../api.endpoints';
import {LoaderService} from '../../shared/services/loader.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) { }

  getAll(): Observable<PaginationModel<User>> {
    return this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`);
  }
}
