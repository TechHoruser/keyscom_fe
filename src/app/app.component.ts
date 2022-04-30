import {Component} from '@angular/core';
import moment from 'moment/moment';
import {$localize} from '@angular/localize/init';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'app';

  public constructor() {
    // This line establish the language on moment objects and Monday as first day of week
    moment.updateLocale('es', {
      week: {
        dow: 0,
        // dow: 1, // Problem with first week of the year include sunday
      },
    });
  }
}
