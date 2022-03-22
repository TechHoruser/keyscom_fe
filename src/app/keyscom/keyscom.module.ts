import {NgModule} from '@angular/core';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LayoutComponent} from './layout/layout.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    KeyscomRoutingModule,
  ],
  exports: [
    KeyscomRoutingModule,
  ]
})
export class KeyscomModule {}
