import {AfterViewInit, Component} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements AfterViewInit {
  paginatorSize: number = environment.DEFAULT_PAGINATOR_SIZE;
  paginatorSizeOptions: number[] = environment.DEFAULT_PAGINATOR_SIZE_OPTIONS;

  constructor() {}

  ngAfterViewInit(): void {}
}
