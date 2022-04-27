import {Component, OnInit, ViewChild} from '@angular/core';
import {faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../../../../models/user.model';
import {UserService} from '../../services/user.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;

  displayedColumns: string[] = ['email', 'firstName', 'lastName', 'actions'];

  public dataSource: MatTableDataSource<User>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.userService.users
      .subscribe((users) => {
        if (users) {
          this.dataSource = new MatTableDataSource<User>(users);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });
    this.userService.updateUsers();
  }

  delete(user: User): void
  {
    this.dialogService.open(
      {
        title: 'CONFIRM.DOWNLOAD.JOB.TITLE',
        message: 'CONFIRM.DOWNLOAD.JOB.MESSAGE',
        cancelText: 'CONFIRM.DOWNLOAD.JOB.CANCELTEXT',
        confirmText: 'CONFIRM.DOWNLOAD.JOB.CONFIRMTEXT',
      },
      () => this.userService.deleteByUuid(user.uuid).subscribe(
        () => this.userService.updateUsers()
      ),
    );
  }
}
