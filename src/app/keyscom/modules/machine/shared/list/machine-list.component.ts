import {Component, OnInit, ViewChild} from '@angular/core';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {faBriefcase, faListAlt, faPencilAlt, faTrashAlt, faUserTie} from '@fortawesome/free-solid-svg-icons';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {Machine} from '../../../../models/machine.model';
import {MachineService} from '../../services/machine.service';
import {ConfirmDialogService} from '../../../dialog/services/confirm-dialog.service';
import {FormControl, FormGroup} from '@angular/forms';
import {Client} from '../../../../models/client.model';
import {Project} from '../../../../models/project.model';
import {StringHelperService} from '../../../shared/services/string-helper.service';
import {ClientService} from '../../../client/services/client.service';
import {ProjectService} from '../../../project/services/project.service';

@Component({
  selector: 'app-machine-list',
  templateUrl: './machine-list.component.html',
  styleUrls: ['./machine-list.component.scss']
})
export class MachineListComponent implements OnInit {
  faPencilAlt = faPencilAlt;
  faTrashAlt = faTrashAlt;
  faListAlt = faListAlt;
  faUserTie = faUserTie;
  faBriefcase = faBriefcase;
  filters: FormGroup;
  private filtersLastRawValue: string;
  private clientList: Client[];
  public filteredClientList: Client[];
  private projectList: Project[];
  public filteredProjectList: Project[];

  displayedColumns: string[] = ['name', 'domain', 'ip', 'actions'];

  public dataSource: MatTableDataSource<Machine>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private machineService: MachineService,
    private dialogService: ConfirmDialogService,
    private clientService: ClientService,
    private projectService: ProjectService,
    private stringHelperService: StringHelperService,
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

    this.clientService.getClients()
      .subscribe((paginationClient) => {
        this.clientList = paginationClient.results;
        this.filteredClientList = paginationClient.results;
      });

    this.projectService.getProjects({}, ['client'])
      .subscribe((paginationProject) => {
        this.projectList = paginationProject.results;
        this.filteredProjectList = paginationProject.results;
      });

    this.initializeFilterForm();
  }

  private initializeFilterForm(): void
  {
    this.filters = new FormGroup({
      name: new FormControl(''),
      domain: new FormControl(''),
      ip: new FormControl(''),
      clientFilter: new FormControl(''),
      'project.client.uuid': new FormControl(''),
      projectFilter: new FormControl(''),
      'project.uuid': new FormControl(''),
    });

    this.filters.controls.projectFilter.disable();
    this.filtersLastRawValue = JSON.stringify(this.getFilterFromForm());

    const filterProjects = () => {
      this.filteredProjectList = this.projectList.filter(
        (project) =>
          this.stringHelperService.contains(project.name, this.filters.controls.projectFilter.value)
          && project.client.uuid === this.filters.controls['project.client.uuid'].value
      );
    };

    const filterClients = () => {
      this.filteredClientList = this.clientList.filter(
        (client) => this.stringHelperService.contains(client.name, this.filters.controls.clientFilter.value)
      );
    };

    this.filters.controls.clientFilter.valueChanges.subscribe(() => filterClients());
    this.filters.controls.projectFilter.valueChanges.subscribe(() => filterProjects());

    this.filters.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        const filters = this.getFilterFromForm();
        const filterMachineCurrentRawValue = JSON.stringify(filters);
        if (this.filtersLastRawValue !== filterMachineCurrentRawValue) {
          this.machineService.updateMachines(filters);
          this.filtersLastRawValue = filterMachineCurrentRawValue;
        }
      });
  }

  private getFilterFromForm(): object
  {
    const filters = this.filters.getRawValue();

    delete filters.clientFilter;
    if (!filters['project.client.uuid']) {
      delete filters['project.client.uuid'];
    }

    delete filters.projectFilter;
    if (!filters['project.uuid']) {
      delete filters['project.uuid'];
    }

    return filters;
  }

  public selectClient(client?: Client): void {
    if (client) {
      this.filters.controls.projectFilter.enable();
    } else {
      this.filters.controls.projectFilter.disable();
    }

    this.filters.patchValue({
      clientFilter: client?.name,
      'project.client.uuid': client?.uuid,
      projectFilter: '',
      'project.uuid': '',
    });
  }

  public selectProject(project?: Project): void {
    this.filters.patchValue({
      projectFilter: project?.name,
      'project.uuid': project?.uuid,
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
