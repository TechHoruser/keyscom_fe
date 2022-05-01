import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {environment} from '../../../../../environments/environment';
import {CLIENT_DELETE, CLIENT_LIST} from '../../../api.endpoints';
import {Client} from '../../../models/client.model';
import {HttpHelperService} from '../../shared/services/http-helper.service';

@Injectable({ providedIn: 'root' })
export class ClientService {
  public clients: BehaviorSubject<Client[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: HttpHelperService,
  ) {
    this.clients = new BehaviorSubject([]);
  }

  updateClients(filters?: object): void {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    this.http.get<PaginationModel<Client>>(`${environment.API_HOST}${CLIENT_LIST}`, options)
      .subscribe((res) => this.clients.next(res.results));
  }

  deleteByUuid(clientUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${CLIENT_DELETE}`.replace(':clientUuid', clientUuid));
  }
}
