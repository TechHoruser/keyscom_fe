import {Component, OnInit, ViewChild} from '@angular/core';
import {faListAlt, faPencilAlt, faTrashAlt, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Project} from '../../../../models/project.model';
import {ProjectService} from '../../services/project.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {ApiHelperService} from '../../../shared/services/api-helper.service';
import {ClientSelectListComponent} from '../../../client/shared/select-list/client-select-list.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {
  @ViewChild(ClientSelectListComponent) clientSelector: ClientSelectListComponent;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  faUserTie = faUserTie;
  filters: FormGroup;
  private filtersLastRawValue: string;

  displayedColumns: string[] = ['name', 'startDate', 'endDate', 'actions'];

  public dataSource: MatTableDataSource<Project>;

  constructor(
    private projectService: ProjectService,
    private dialogService: ConfirmDialogService,
    private apiHelperService: ApiHelperService,
  ) { }

  ngOnInit(): void {
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
      startDateStartRange: new FormControl(''),
      startDateEndRange: new FormControl(''),
      endDateStartRange: new FormControl(''),
      endDateEndRange: new FormControl(''),
      'client.uuid': new FormControl(''),
    });

    this.filtersLastRawValue = JSON.stringify(this.getFilterFromForm());

    this.filters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const filters = this.getFilterFromForm();
        const filterMachineCurrentRawValue = JSON.stringify(filters);
        if (this.filtersLastRawValue !== filterMachineCurrentRawValue) {
          this.projectService.updateProjects(filters);
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  updateClientUuid(clientUuid: string | null): void {
    this.filters.patchValue({'client.uuid': clientUuid});
  }

  private getFilterFromForm(): object
  {
    const filters = this.filters.getRawValue();

    filters.startDate = this.apiHelperService.convertMomentRangeToFilterString(
      filters.startDateStartRange,
      filters.startDateEndRange,
    );
    delete filters.startDateStartRange;
    delete filters.startDateEndRange;

    filters.endDate = this.apiHelperService.convertMomentRangeToFilterString(
      filters.endDateStartRange,
      filters.endDateEndRange,
    );
    delete filters.endDateStartRange;
    delete filters.endDateEndRange;

    if (!filters['client.uuid']){
      delete filters['client.uuid'];
    }

    return filters;
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
