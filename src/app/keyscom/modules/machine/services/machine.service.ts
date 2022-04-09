import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {PaginationModel} from '../../../models/pagination.model';
import {environment} from '../../../../../environments/environment';
import {MACHINE_LIST} from '../../../api.endpoints';
import {Machine} from '../../../models/machine.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MachineService {
  public machines: BehaviorSubject<Machine[]>;

  constructor(private http: HttpClient)
  {
    this.machines = new BehaviorSubject([]);
  }

  convertAnyToHttp(params: object, isRoot: boolean = true): { [param: string]: string | string[]; }
  {
    const returnParams = {};
    Object.keys(params).forEach(paramKey => {
      const paramValue = params[paramKey];
      paramKey = isRoot ? paramKey : `[${paramKey}]`;
      if (typeof paramValue === 'object') {
        const queryStringArray = this.convertAnyToHttp(paramValue, false);
        Object.keys(queryStringArray).forEach(queryStringArrayKey => {
          returnParams[`${paramKey}${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
        });
      } else if (Array.isArray(paramValue)) {
        paramValue.forEach((paramSubValue, paramSubValueIndex) => {
          const queryStringArray = this.convertAnyToHttp(paramSubValue, false);
          Object.keys(queryStringArray).forEach(queryStringArrayKey => {
            returnParams[`[${paramSubValueIndex}]${queryStringArrayKey}`] = queryStringArray[queryStringArrayKey];
          });
        });
      } else {
        returnParams[paramKey] = paramValue;
      }
    });
    return returnParams;
  }

  updateMachines(filters?: object): void
  {
    const options = filters !== undefined ? {
      params: this.convertAnyToHttp({filters}),
    } : {};
    this.http.get<PaginationModel<Machine>>(
      `${environment.API_HOST}${MACHINE_LIST}`,
      options,
    ).subscribe(res => this.machines.next(res.results));
  }
}
