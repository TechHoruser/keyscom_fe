import {Component, OnInit, ViewChild} from '@angular/core';
import {faListAlt, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Client} from '../../../../models/client.model';
import {ClientService} from '../../services/client.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.scss']
})
export class ClientListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;

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
