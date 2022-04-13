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
    let uuid1: string;
    let uuid2: string;
    let uuid3: string;
    setTimeout(() => uuid1 = this.loaderService.showLoader(), 1200);
    setTimeout(() => this.loaderService.hideLoader(uuid1), 1750);
    setTimeout(() => uuid2 = this.loaderService.showLoader(), 1800);
    setTimeout(() => uuid3 = this.loaderService.showLoader(), 2000);
    setTimeout(() => this.loaderService.hideLoader(uuid3), 2100);
    setTimeout(() => this.loaderService.hideLoader(uuid2), 2300);
    return this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`);
  }
}
