import {Injectable} from '@angular/core';
import {Machine} from '../../../models/machine.model';
import {MachineService} from './machine.service';
import {AlertService} from '../../layout/services/alert.service';

@Injectable({ providedIn: 'root' })
export class MapMachineService {
  public machines: Map<string, Machine>;

  constructor(
    private machineService: MachineService,
    private alertService: AlertService,
  ) {
    this.machines = new Map<string, Machine>();
    this.updateMachines();
  }

  private updateMachines(): void
  {
    this.machines.clear();
    this.machineService.getMachines().subscribe(
      (paginationUser) => paginationUser.results.map(
        (machine) => this.machines.set(machine.uuid, machine)
      )
    );
  }

  get(uuid: string): Machine {
    const machine = this.machines.get(uuid);
    if (!machine) {
      this.alertService.error($localize`Machine doesn't exist`);
    }
    return machine;
  }
}
