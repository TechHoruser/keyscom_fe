import {Component, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MachineService} from '../../services/machine.service';
import {CreateMachineEntity} from '../../shared/create-machine.entity';
import {ClientSelectListComponent} from '../../../client/shared/select-list/client-select-list.component';
import {ProjectSelectListComponent} from '../../../project/shared/select-list/project-select-list.component';

@Component({
  selector: 'app-machine-create',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.scss'],
})
export class MachineCreateComponent implements OnInit {
  @ViewChild(ClientSelectListComponent) clientSelector: ClientSelectListComponent;
  @ViewChild(ProjectSelectListComponent) projectSelector: ProjectSelectListComponent;
  form: FormGroup;

  constructor(
    private router: Router,
    private machineService: MachineService,
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
      domain: new FormControl(''),
      ip: new FormControl('', [
        Validators.required,
      ]),
    });
  }

  public saveMachine(): void {
    const validateForm = this.form.valid;
    const validateClient = this.clientSelector.isValid();
    if (validateForm && validateClient) {
      this.machineService.createMachine(this.getCreateMachineEntity())
        .subscribe(() => this.router.navigate(['/machine']));
    }
  }

  private getCreateMachineEntity(): CreateMachineEntity
  {
    const formValues = this.form.getRawValue();

    formValues.clientUuid = this.clientSelector.getValue();
    formValues.projectUuid = this.projectSelector.getValue();

    return formValues as CreateMachineEntity;
  }

  public changeSelectedClient(clientUuid?: string): void {
    this.projectSelector.updateClientUuid(clientUuid);
  }
}
