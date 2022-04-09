import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
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
export class ClientListComponent implements OnInit, OnDestroy {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  private subs = new Subscription();

  displayedColumns: string[] = ['name', 'actions'];

  public dataSource: MatTableDataSource<Client>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private dataArray: any;

  constructor(
    private clientService: ClientService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.subs.add(this.clientService.getAll()
      .subscribe((res) => {
        this.dataArray = res.results;
        this.dataSource = new MatTableDataSource<Client>(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }));
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
