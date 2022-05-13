import {Injectable} from '@angular/core';
import {Project} from '../../../models/project.model';
import {ProjectService} from './project.service';
import {AlertService} from '../../layout/services/alert.service';

@Injectable({ providedIn: 'root' })
export class MapProjectService {
  public projects: Map<string, Project>;

  constructor(
    private projectService: ProjectService,
    private alertService: AlertService,
  ) {
    this.projects = new Map<string, Project>();
    this.updateProjects();
  }

  private updateProjects(): void
  {
    this.projects.clear();
    this.projectService.getProjects().subscribe(
      (paginationUser) => paginationUser.results.map(
        (project) => this.projects.set(project.uuid, project)
      )
    );
  }

  get(uuid: string): Project {
    const project = this.projects.get(uuid);
    if (!project) {
      this.alertService.error($localize`Project doesn't exist`);
    }
    return project;
  }
}
