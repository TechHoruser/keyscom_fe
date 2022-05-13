import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MachineService} from '../../services/machine.service';
import {CreateMachineEntity} from '../../shared/create-machine.entity';

@Component({
  selector: 'app-machine-modify',
  templateUrl: './machine-modify.component.html',
  styleUrls: ['./machine-modify.component.scss'],
})
export class MachineModifyComponent implements OnInit {
  form: FormGroup;
  uuid: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private machineService: MachineService,
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl('', [
        Validators.required,
      ]),
    });

    this.route.params.subscribe(params => {
      this.uuid = params.uuid;
      this.machineService.getMachine(this.uuid).subscribe(machine => {
        this.form.patchValue({name: machine.name});
      });
    });
  }

  public updateMachine(): void {
    if (this.form.valid) {
      this.machineService.updateMachine(this.uuid, this.form.value as CreateMachineEntity)
        .subscribe(() => this.router.navigate(['/machine']));
    }
  }
}
