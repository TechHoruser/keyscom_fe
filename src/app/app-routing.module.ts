import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallbackComponent} from './shared/component/callback/callback.component';
import {LayoutComponent} from './keyscom/layout/layout.component';
import {AuthGuard} from './shared/auth/auth.guard';
import {LoginComponent} from './shared/component/login/login.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./keyscom/keyscom.module').then(m => m.KeyscomModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
