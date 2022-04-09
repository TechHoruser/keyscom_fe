import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subscription} from 'rxjs';
import {faListAlt, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Project} from '../../../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  private subs = new Subscription();
  filterProject: FormGroup;

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];

  public dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private dataArray: any;

  constructor(
    private projectService: ProjectService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.filterProject = new FormGroup({
      name: new FormControl('Name', Validators.minLength(2)),
      startDate: new FormControl(),
    });
    this.subs.add(this.projectService.getAll()
      .subscribe((res) => {
        this.dataArray = res.results;
        this.dataSource = new MatTableDataSource<Project>(this.dataArray);
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
