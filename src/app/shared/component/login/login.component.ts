import {AfterViewInit, Component} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements AfterViewInit {
  paginatorSize: number = environment.DEFAULT_PAGINATOR_SIZE;
  paginatorSizeOptions: number[] = environment.DEFAULT_PAGINATOR_SIZE_OPTIONS;

  constructor() {}

  ngAfterViewInit(): void {}
}
