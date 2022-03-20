import {AfterViewInit, Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class LoginComponent implements AfterViewInit {
  paginatorSize: number = environment.DEFAULT_PAGINATOR_SIZE;
  paginatorSizeOptions: number[] = environment.DEFAULT_PAGINATOR_SIZE_OPTIONS;

  constructor(
    private router: Router,
    private translateService: TranslateService
  ) {
    translateService.addLangs(environment.LANGS_AVAILABLE);
    translateService.setDefaultLang(environment.LANG_DEFAULT);
  }

  ngAfterViewInit(): void {}
}
