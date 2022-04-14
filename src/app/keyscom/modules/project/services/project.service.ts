import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';
import {PaginationModel} from '../../../models/pagination.model';
import {Project} from '../../../models/project.model';
import {environment} from '../../../../../environments/environment';
import {PROJECT_LIST} from '../../../api.endpoints';
import {LoaderService} from '../../shared/services/loader.service';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  public projects: BehaviorSubject<Project[]>;

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
  ) {
    this.projects = new BehaviorSubject([]);
  }

  updateProjects(): void {
    const loaderUuid = this.loaderService.showLoader();
    this.http.get<PaginationModel<Project>>(`${environment.API_HOST}${PROJECT_LIST}`)
      .subscribe((res) => {
        this.projects.next(res.results);
        this.loaderService.hideLoader(loaderUuid);
      });
  }
}
