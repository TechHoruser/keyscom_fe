import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {PROJECT_LIST} from '../../../api.endpoints';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<PaginationModel<User>> {
    return this.http.get<PaginationModel<User>>(`${environment.API_HOST}${PROJECT_LIST}`);
  }
}
