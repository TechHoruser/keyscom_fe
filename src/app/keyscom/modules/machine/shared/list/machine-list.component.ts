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

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']
})
export class MachineListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  filters: FormGroup;
  private filtersLastRawValue: string;

  displayedColumns: string[] = ['name', 'domain', 'ip', 'actions'];

  public dataSource: MatTableDataSource<Machine>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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

    this.filters.controls.projectFilter.disable();
    this.filtersLastRawValue = JSON.stringify(this.getFilterFromForm());

    this.filters.controls['project.client.uuid'].valueChanges.subscribe(() => {
      // TODO: call change client into
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
      this.filters.controls.projectFilter.enable();
    } else {
      this.filters.controls.projectFilter.disable();
    }
    this.filters.patchValue({
      'project.client.uuid': clientUuid,
      'project.uuid': '',
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
        title: 'CONFIRM.DOWNLOAD.JOB.TITLE',
        message: 'CONFIRM.DOWNLOAD.JOB.MESSAGE',
      },
      () => this.machineService.deleteByUuid(machine.uuid).subscribe(
        () => this.machineService.updateMachines()
      ),
    );
  }
}
