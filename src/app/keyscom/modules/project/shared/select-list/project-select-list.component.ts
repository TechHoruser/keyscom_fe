import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../../../models/project.model';
import {StringHelperService} from '../../../shared/services/string-helper.service';
import {MapProjectService} from '../../services/map-project.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-project-select-list',
  templateUrl: './project-select-list.component.html',
  styleUrls: ['./project-select-list.component.scss'],
})
export class ProjectSelectListComponent implements OnInit {
  @Input() required = false;
  @Input() disabled = false;
  @Output() changeSelectedProject = new EventEmitter<string | null>();

  form: FormGroup;
  private projectList: Project[];
  public filteredProjectList: Project[];
  private clientUuid?: BehaviorSubject<string | null>;

  constructor(
    private mapProjectService: MapProjectService,
    private stringHelperService: StringHelperService,
  ) {
    this.clientUuid = new BehaviorSubject(null);
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    this.projectList = await this.mapProjectService.getValues();
    this.filteredProjectList = this.projectList;

    this.clientUuid.subscribe(async (newClientUuid) => {
      this.form.patchValue({projectFilter: '', projectUuid: ''});
      this.projectList = (await this.mapProjectService.getValues())
        .filter((project) => project.client.uuid === newClientUuid);
      this.filteredProjectList = this.projectList;
      if (newClientUuid) {
        this.enable();
      } else {
        this.disable();
      }
    });

    if (this.disabled) {
      this.disable();
    }
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

    this.form.controls.projectUuid.valueChanges.subscribe((value) => this.changeSelectedProject.emit(value));
  }

  public selectProject(project?: Project): void {
    this.form.patchValue({
      projectFilter: project?.name ?? '',
      projectUuid: project?.uuid ?? '',
    });
  }

  public enable(): void {
    this.form.controls.projectFilter.enable();
  }

  public disable(): void {
    this.form.controls.projectFilter.disable();
    this.form.patchValue({projectFilter: '', projectUuid: ''});
  }

  public updateClientUuid(clientUuid?: string): void {
    this.clientUuid.next(clientUuid);
  }

  // Unuse async problem with selectProject method
  public async closeAutocomplete(): Promise<void> {
    // if (this.form.controls.projectUuid.value) {
    //   const selectedProjectName = (await this.mapProjectService.get(this.form.controls.projectUuid.value)).name;
    //   if (selectedProjectName === this.form.controls.projectFilter.value) {
    //     return;
    //   }
    //   this.form.patchValue({projectFilter: selectedProjectName});
    // } else {
    //   this.form.patchValue({projectFilter: ''});
    // }
  }

  public isValid(): boolean {
    if (!this.form.controls.projectUuid.valid) {
      this.form.patchValue({projectFilter: ''});
    }

    this.form.markAsTouched();
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
