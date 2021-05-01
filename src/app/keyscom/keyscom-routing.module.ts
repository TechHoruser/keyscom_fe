import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserPermissionsConstants} from '../shared/auth/user-permissions.constants';
import {DashboardComponent} from './components/dashboard.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { permission: UserPermissionsConstants.PERMISSION_DASHBOARD_VIEW}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KeyscomRoutingModule { }
