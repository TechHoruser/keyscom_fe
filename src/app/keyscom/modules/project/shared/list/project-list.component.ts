import {Component, OnInit, ViewChild} from '@angular/core';
import {faListAlt, faPencilAlt, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Project} from '../../../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  filters: FormGroup;
  private filtersLastRawValue: string;

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];

  public dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private projectService: ProjectService,
    private dialogService: ConfirmDialogService,
  ) { }

  ngOnInit(): void {
    this.filters = new FormGroup({
      name: new FormControl('', Validators.minLength(2)),
      startDate: new FormControl(),
    });

    this.projectService.projects
      .subscribe((projects) => {
        if (projects) {
          this.dataSource = new MatTableDataSource<Project>(projects);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      });

    this.projectService.updateProjects();

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filters = new FormGroup({
      name: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });

    this.filtersLastRawValue = JSON.stringify(this.filters.getRawValue());

    this.filters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        console.log(this.filters.getRawValue());
        const filterMachineCurrentRawValue = JSON.stringify(this.filters.getRawValue());
        if (this.filtersLastRawValue !== filterMachineCurrentRawValue) {
          this.projectService.updateProjects(this.filters.getRawValue());
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  delete(project: Project): void
  {
    this.dialogService.open(
      {
        title: $localize`Delete Project`,
        message: $localize`Delete "${project.name}:name:"?`,
      },
      () => this.projectService.deleteByUuid(project.uuid).subscribe(
        () => this.projectService.updateProjects()
      ),
    );
  }
}
