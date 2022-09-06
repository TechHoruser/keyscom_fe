import {Component, OnInit, ViewChild} from '@angular/core';
import {faListAlt, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Client} from '../../../../models/client.model';
import {ClientService} from '../../services/client.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  filters: FormGroup;
  private filtersLastRawValue: string;

  displayedColumns: string[] = ['name', 'actions'];

  public dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private clientService: ClientService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.clientService.clients
      .subscribe((clients) => {
        if (clients) {
          this.dataSource = new MatTableDataSource<Client>(clients);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });

    this.clientService.updateClients();

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filters = new FormGroup({
      name: new FormControl(''),
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
          this.clientService.updateClients(this.filters.getRawValue());
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  delete(client: Client): void
  {
    this.dialogService.open(
      {
        title: $localize`CONFIRM.DELETE.TITLE`,
        message: $localize`CONFIRM.DELETE.MESSAGE`,
      },
      () => this.clientService.deleteByUuid(client.uuid).subscribe(
        () => this.clientService.updateClients()
      ),
    );
  }
}
