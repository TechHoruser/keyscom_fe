import {Injectable} from '@angular/core';
import {Project} from '../../../models/project.model';
import {ProjectService} from './project.service';
import {AlertService} from '../../layout/services/alert.service';
import {firstValueFrom} from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MapProjectService {
  private projects: Map<string, Project>;

  constructor(
    private projectService: ProjectService,
    private alertService: AlertService,
  ) {}

  private async updateProjects(): Promise<void>
  {
    const paginationProject = await firstValueFrom(this.projectService.getProjects({}, ['client', 'machines']));
    const newMap = new Map<string, Project>();
    paginationProject.results.map((project) => newMap.set(project.uuid, project));
    this.projects = newMap;
  }

  async get(uuid: string): Promise<Project> {
    if (!this.projects) {
      await this.updateProjects();
    }

    const project = this.projects.get(uuid);
    if (!project) {
      this.alertService.error($localize`Project doesn't exist`);
    }
    return Promise.resolve(project);
  }

  async getValues(): Promise<Project[]> {
    if (this.projects === undefined) {
      await this.updateProjects();
    }
    return Promise.resolve(Array.from(this.projects.values()));
  }
}
