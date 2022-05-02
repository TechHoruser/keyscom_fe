import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {Project} from '../../../models/project.model';
import {environment} from '../../../../../environments/environment';
import {PROJECT_DELETE, PROJECT_LIST} from '../../../api.endpoints';
import {ApiHelperService} from '../../shared/services/api-helper.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public projects: BehaviorSubject<Project[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: ApiHelperService,
  ) {
    this.projects = new BehaviorSubject([]);
  }

  updateProjects(filters?: object): void {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters}) } :
      {};

    this.http.get<PaginationModel<Project>>(`${environment.API_HOST}${PROJECT_LIST}`, options)
      .subscribe((res) => this.projects.next(res.results));
  }

  deleteByUuid(projectUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${PROJECT_DELETE}`.replace(':projectUuid', projectUuid));
  }
}
