import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LayoutComponent} from './modules/shared/components/layout/layout.component';
import {AuthGuard} from './modules/auth/services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./modules/error/error-routing.module').then(m => m.ErrorRoutingModule),
  },
  {
    path: 'dashboard',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/dashboard/dashboard-routing.module').then(m => m.DashboardRoutingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/user/user-routing.module').then(m => m.UserRoutingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'client',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/client/client-routing.module').then(m => m.ClientRoutingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'project',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/project/project-routing.module').then(m => m.ProjectRoutingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'machine',
    component: LayoutComponent,
    loadChildren: () =>
      import('./modules/machine/machine-routing.module').then(m => m.MachineRoutingModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class KeyscomRoutingModule {}
