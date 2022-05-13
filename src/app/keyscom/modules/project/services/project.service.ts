import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {Project} from '../../../models/project.model';
import {environment} from '../../../../../environments/environment';
import {PROJECT, PROJECT_DELETE, PROJECT_LIST} from '../../../api.endpoints';
import {ApiHelperService} from '../../shared/services/api-helper.service';
import {CreateProjectEntity} from '../shared/create-project.entity';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public projects: BehaviorSubject<Project[]>;

  constructor(
    private http: HttpClient,
    private httpHelperService: ApiHelperService,
  ) {
    this.projects = new BehaviorSubject([]);
  }

  updateProjects(filters: object = {}, embeds: string[] = ['client']): void {
    const options = { params: this.httpHelperService.convertAnyToHttpParams({filters, embeds}) };

    this.http.get<PaginationModel<Project>>(`${environment.API_HOST}${PROJECT_LIST}`, options)
      .subscribe((res) => this.projects.next(res.results));
  }

  getProject(projectUuid: string): Observable<Project> {
    return this.http.get<Project>(`${environment.API_HOST}${PROJECT}`.replace(':projectUuid', projectUuid));
  }

  getProjects(filters?: object, embeds?: string[]): Observable<PaginationModel<Project>> {
    const options = filters !== undefined ?
      { params: this.httpHelperService.convertAnyToHttpParams({filters, embeds}) } :
      {};

    return this.http.get<PaginationModel<Project>>(`${environment.API_HOST}${PROJECT_LIST}`, options);
  }

  updateProject(projectUuid: string, project: CreateProjectEntity): Observable<any>
  {
    return this.http.put<Project>(`${environment.API_HOST}${PROJECT}`.replace(':projectUuid', projectUuid), project);
  }

  deleteByUuid(projectUuid: string): Observable<any>
  {
    return this.http.delete<void>(`${environment.API_HOST}${PROJECT_DELETE}`.replace(':projectUuid', projectUuid));
  }
}
