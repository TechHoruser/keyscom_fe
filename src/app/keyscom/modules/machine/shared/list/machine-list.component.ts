import {Component, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {faBriefcase, faListAlt, faPencilAlt, faTrashAlt, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Machine} from '../../../../models/machine.model';
import {MachineService} from '../../services/machine.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {ClientSelectListComponent} from '../../../client/shared/select-list/client-select-list.component';
import {ProjectSelectListComponent} from '../../../project/shared/select-list/project-select-list.component';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']
})
export class MachineListComponent implements OnInit {
  @ViewChild(ClientSelectListComponent) clientSelector: ClientSelectListComponent;
  @ViewChild(ProjectSelectListComponent) projectSelector: ProjectSelectListComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  filters: FormGroup;
  private filtersLastRawValue: string;

  displayedColumns: string[] = ['name', 'domain', 'ip', 'actions'];

  public dataSource: MatTableDataSource<Machine>;

  constructor(
    private machineService: MachineService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.machineService.machines
      .subscribe((machines) => {
        if (machines) {
          this.dataSource = new MatTableDataSource<Machine>(machines);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });

    this.machineService.updateMachines();

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filters = new FormGroup({
      name: new FormControl(''),
      domain: new FormControl(''),
      ip: new FormControl(''),
      'project.client.uuid': new FormControl(''),
      'project.uuid': new FormControl(''),
    });

    this.filtersLastRawValue = JSON.stringify(this.getFilterFromForm());

    this.filters.controls['project.client.uuid'].valueChanges.subscribe((newClientUuid) => {
      this.projectSelector.updateClientUuid(newClientUuid);
    });

    this.filters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const filters = this.getFilterFromForm();
        const filterMachineCurrentRawValue = JSON.stringify(filters);
        if (this.filtersLastRawValue !== filterMachineCurrentRawValue) {
          this.machineService.updateMachines(filters);
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  private getFilterFromForm(): object
  {
    const filters = this.filters.getRawValue();

    if (!filters['project.client.uuid']) {
      delete filters['project.client.uuid'];
    }

    if (!filters['project.uuid']) {
      delete filters['project.uuid'];
    }

    return filters;
  }

  public changeSelectedClient(clientUuid?: string): void {
    if (clientUuid) {
      this.projectSelector.enable();
    } else {
      this.projectSelector.disable();
    }
    this.projectSelector.updateClientUuid(clientUuid);
    this.filters.patchValue({
      'project.client.uuid': clientUuid ?? '',
    });
  }

  public changeSelectedProject(projectUuid?: string): void {
    this.filters.patchValue({
      'project.uuid': projectUuid ?? '',
    });
  }

  delete(machine: Machine): void
  {
    this.dialogService.open(
      {
        title: $localize`CONFIRM.DELETE.TITLE`,
        message: $localize`CONFIRM.DELETE.MESSAGE`,
      },
      () => this.machineService.deleteByUuid(machine.uuid).subscribe(
        () => this.machineService.updateMachines()
      ),
    );
  }
}
