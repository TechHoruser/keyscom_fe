import {Component, OnInit, ViewChild} from '@angular/core';
import {faListAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {User} from '../../../../models/user.model';
import {UserService} from '../../services/user.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  faListAlt = faListAlt;
  faTrashAlt = faTrashAlt;
  filters: FormGroup;
  private filtersLastRawValue: string;

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

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filters = new FormGroup({
      email: new FormControl(''),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
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
          this.userService.updateUsers(this.filters.getRawValue());
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  delete(user: User): void
  {
    this.dialogService.open(
      {
        title: $localize`CONFIRM.DELETE.TITLE`,
        message: $localize`CONFIRM.DELETE.MESSAGE`,
      },
      () => this.userService.deleteByUuid(user.uuid).subscribe(
        () => this.userService.updateUsers()
      ),
    );
  }
}
