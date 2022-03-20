import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {SharedModule} from '../shared/shared.module';
import {LayoutComponent} from './layout/layout.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatExpansionModule} from '@angular/material/expansion';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DashboardComponent} from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    LayoutComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    KeyscomRoutingModule,
    FontAwesomeModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,
  ],
  exports: [
    KeyscomRoutingModule,
    FontAwesomeModule,
    MatExpansionModule,
    MatListModule,
    MatSidenavModule,
  ]
})
export class KeyscomModule {}
