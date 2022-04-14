import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {User} from '../../../models/user.model';
import {environment} from '../../../../../environments/environment';
import {USER_LIST} from '../../../api.endpoints';
import {LoaderService} from '../../shared/services/loader.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  public users: BehaviorSubject<User[]>;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {
    this.users = new BehaviorSubject([]);
  }

  updateUsers(): void {
    const loaderUuid = this.loaderService.showLoader();
    this.http.get<PaginationModel<User>>(`${environment.API_HOST}${USER_LIST}`)
      .subscribe((res) => {
        this.users.next(res.results);
        this.loaderService.hideLoader(loaderUuid);
      });
  }
}
