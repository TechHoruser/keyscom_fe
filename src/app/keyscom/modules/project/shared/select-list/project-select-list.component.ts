import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../../../models/project.model';
import {StringHelperService} from '../../../shared/services/string-helper.service';
import {ProjectService} from '../../services/project.service';
import {MapProjectService} from '../../services/map-project.service';

@Component({
  selector: 'app-project-select-list',
  templateUrl: './project-select-list.component.html',
  styleUrls: ['./project-select-list.component.scss'],
})
export class ProjectSelectListComponent implements OnInit {
  @Input() required = false;
  @Output() changeSelectedProject = new EventEmitter<string | null>();

  form: FormGroup;
  private projectList: Project[];
  public filteredProjectList: Project[];

  constructor(
    private projectService: ProjectService,
    private mapProjectService: MapProjectService,
    private stringHelperService: StringHelperService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.projectService.getProjects().subscribe((paginationProjects) => {
      this.projectList = paginationProjects.results;
      this.filteredProjectList = paginationProjects.results;
    });
  }

  private initForm(): void
  {
    const projectFilterValidator = [];
    if (this.required) {
      projectFilterValidator.push(Validators.required);
    }
    this.form = new FormGroup({
      projectFilter: new FormControl('', projectFilterValidator),
      projectUuid: new FormControl(''),
    });

    this.form.controls.projectFilter.valueChanges
      .subscribe((value) => {
        this.filteredProjectList = this.projectList.filter(
          (project) => this.stringHelperService.contains(project.name, value)
        );
      });
  }

  public selectProject(project?: Project): void {
    this.form.patchValue({
      projectFilter: project?.name,
      projectUuid: project?.uuid,
    });

    this.changeSelectedProject.emit(project?.uuid);
  }

  public closeAutocomplete(): void {
    if (this.form.controls.projectUuid.value) {
      const selectedProjectName = this.mapProjectService.get(this.form.controls.projectUuid.value).name;
      if (selectedProjectName === this.form.controls.projectFilter.value) {
        return;
      }
      this.form.patchValue({projectFilter: selectedProjectName});
    } else {
      this.form.patchValue({projectFilter: ''});
    }
  }

  public isValid(): boolean {
    if (!this.form.controls.projectUuid.valid) {
      this.form.patchValue({projectFilter: ''});
    }

    return this.form.valid;
  }

  public getValue(): string | null
  {
    const projectUuid = this.form.controls.projectUuid.value;
    if (!projectUuid) {
      return null;
    }
    return projectUuid;
  }
}
