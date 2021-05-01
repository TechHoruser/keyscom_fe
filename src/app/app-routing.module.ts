import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CallbackComponent} from './shared/component/callback/callback.component';
import {LayoutComponent} from './keyscom/layout/layout.component';
import {AuthGuardService} from './shared/auth/authguard.service';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./keyscom/keyscom.module').then(m => m.KeyscomModule),
    canActivate: [AuthGuardService]
  },
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
