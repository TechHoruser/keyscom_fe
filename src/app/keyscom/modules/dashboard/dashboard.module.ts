import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {DashboardMainComponent} from './components/main/dashboard-main.component';

@NgModule({
  declarations: [
    DashboardMainComponent
  ],
  imports: [
    SharedModule,
  ],
})

export class DashboardModule {}
