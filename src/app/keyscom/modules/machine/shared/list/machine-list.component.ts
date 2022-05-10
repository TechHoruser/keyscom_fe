import {Component, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {faListAlt, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
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
    });

    this.filtersLastRawValue = JSON.stringify(this.filters.getRawValue());

    this.filters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const filterMachineCurrentRawValue = JSON.stringify(this.filters.getRawValue());
        if (this.filtersLastRawValue !== filterMachineCurrentRawValue) {
          this.machineService.updateMachines(this.filters.getRawValue());
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
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
