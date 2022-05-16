import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ProjectService} from '../../services/project.service';
import {CreateProjectEntity} from '../../shared/create-project.entity';
import {ApiHelperService} from '../../../shared/services/api-helper.service';
import {ClientSelectListComponent} from '../../../client/shared/select-list/client-select-list.component';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  @ViewChild(ClientSelectListComponent) clientSelector: ClientSelectListComponent;
  form: FormGroup;

  constructor(
    private router: Router,
    private projectService: ProjectService,
    private apiHelper: ApiHelperService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void
  {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
      startDate: new FormControl('', [
        Validators.required,
      ]),
      endDate: new FormControl(''),
    });
  }

  public saveProject(): void {
    const validateForm = this.form.valid;
    const validateClient = this.clientSelector.isValid();
    if (validateForm && validateClient) {
      this.projectService.createProject(this.getCreateProjectEntity())
        .subscribe(() => this.router.navigate(['/project']));
    }
  }

  private getCreateProjectEntity(): CreateProjectEntity
  {
    const formValues = this.form.getRawValue();

    formValues.startDate = this.apiHelper.getStringFromMoment(formValues.startDate);
    formValues.endDate = this.apiHelper.getStringFromMoment(formValues.endDate);
    formValues.clientUuid = this.clientSelector.getValue();

    return formValues as CreateProjectEntity;
  }
}
