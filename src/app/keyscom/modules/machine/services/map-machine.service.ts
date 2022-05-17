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

  async get(uuid: string): Promise<Machine> {
    if (!this.machines) {
      await this.updateMachines();
    }

    const machine = this.machines.get(uuid);
    if (!machine) {
      this.alertService.error($localize`Machine doesn't exist`);
    }
    return Promise.resolve(machine);
  }

  async getValues(): Promise<Machine[]> {
    if (this.machines === undefined) {
      await this.updateMachines();
    }
    return Promise.resolve(Array.from(this.machines.values()));
  }

  async getMap(): Promise<Map<string, Machine>> {
    if (this.machines === undefined) {
      await this.updateMachines();
    }
    return Promise.resolve(this.machines);
  }

  async isLoaded(): Promise<true> {
    if (this.machines === undefined) {
      await this.updateMachines();
    }
    return Promise.resolve(true);
  }
}
