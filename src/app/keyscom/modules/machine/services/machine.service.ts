import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationModel} from '../../../models/pagination.model';
import {environment} from '../../../../../environments/environment';
import {MACHINE_DELETE, MACHINE_LIST} from '../../../api.endpoints';
import {Machine} from '../../../models/machine.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {HttpHelperService} from '../../shared/services/http-helper.service';

@Injectable({ providedIn: 'root' })
export class MachineService {
  public machines: BehaviorSubject<Machine[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: HttpHelperService,
  ) {
    this.machines = new BehaviorSubject([]);
  }

  updateMachines(filters?: object): void {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    this.http.get<PaginationModel<Machine>>(`${environment.API_HOST}${MACHINE_LIST}`, options)
      .subscribe((res) => this.machines.next(res.results));
  }

  deleteByUuid(machineUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${MACHINE_DELETE}`.replace(':machineUuid', machineUuid));
  }
}
