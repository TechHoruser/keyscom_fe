import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged, Subscription} from 'rxjs';
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
export class MachineListComponent implements OnInit, OnDestroy {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  private subs = new Subscription();
  filterMachine: FormGroup;

  displayedColumns: string[] = ['name', 'domain', 'ip', 'type', 'actions'];

  public dataSource: MatTableDataSource<Machine>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private dataArray: any;

  private filterMachineLastRawValue: string;

  constructor(
    private machineService: MachineService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.subs.add(this.machineService.machines
      .subscribe((data) => {
        this.dataArray = data;
        this.dataSource = new MatTableDataSource<Machine>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));

    this.machineService.updateMachines();

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filterMachine = new FormGroup({
      name: new FormControl(''),
      domain: new FormControl(''),
      ip: new FormControl(''),
    });

    this.filterMachineLastRawValue = JSON.stringify(this.filterMachine.getRawValue());

    this.filterMachine.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const filterMachineCurrentRawValue = JSON.stringify(this.filterMachine.getRawValue());
        if (this.filterMachineLastRawValue !== filterMachineCurrentRawValue) {
          this.machineService.updateMachines(this.filterMachine.getRawValue());
          this.filterMachineLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  delete(): void
  {
    this.dialogService.open({
      title: 'CONFIRM.DOWNLOAD.JOB.TITLE',
      message: 'CONFIRM.DOWNLOAD.JOB.MESSAGE',
      cancelText: 'CONFIRM.DOWNLOAD.JOB.CANCELTEXT',
      confirmText: 'CONFIRM.DOWNLOAD.JOB.CONFIRMTEXT',
    });
  }
}
