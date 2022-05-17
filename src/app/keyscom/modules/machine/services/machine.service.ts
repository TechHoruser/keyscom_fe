import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationModel} from '../../../models/pagination.model';
import {environment} from '../../../../../environments/environment';
import {MACHINE, MACHINE_UUID} from '../../../api.endpoints';
import {Machine} from '../../../models/machine.model';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiHelperService} from '../../shared/services/api-helper.service';
import {CreateMachineEntity} from '../shared/create-machine.entity';

@Injectable({ providedIn: 'root' })
export class MachineService {
  public machines: BehaviorSubject<Machine[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: ApiHelperService,
  ) {
    this.machines = new BehaviorSubject([]);
  }

  updateMachines(filters: object = {}, embeds: string[] = ['project.client']): void {
    const options = { params: this.httpHelperService.convertAnyToHttpParams({filters, embeds}) };

    this.http.get<PaginationModel<Machine>>(`${environment.API_HOST}${MACHINE}`, options)
      .subscribe((res) => this.machines.next(res.results));
  }

  getMachine(machineUuid: string, embeds: string[] = []): Observable<Machine> {
    return this.http.get<Machine>(
      `${environment.API_HOST}${MACHINE_UUID}`.replace(':machineUuid', machineUuid),
      { params: this.httpHelperService.convertAnyToHttpParams({embeds}) },
    );
  }

  getMachines(filters?: object, embeds?: string[]): Observable<PaginationModel<Machine>> {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters, embeds}) } :
      {};

    return this.http.get<PaginationModel<Machine>>(`${environment.API_HOST}${MACHINE}`, options);
  }

  createMachine(machine: CreateMachineEntity): Observable<any>
  {
    return this.http.post<Machine>(`${environment.API_HOST}${MACHINE}`, machine);
  }

  updateMachine(machineUuid: string, machine: CreateMachineEntity): Observable<any>
  {
    return this.http.put<Machine>(`${environment.API_HOST}${MACHINE_UUID}`.replace(':machineUuid', machineUuid), machine);
  }

  deleteByUuid(machineUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${MACHINE_UUID}`.replace(':machineUuid', machineUuid));
  }
}
