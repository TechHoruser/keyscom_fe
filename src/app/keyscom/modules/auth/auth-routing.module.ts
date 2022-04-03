import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LogoutComponent} from './component/logout/logout.component';
import {LoginComponent} from './component/login/login.component';

const routes: Routes = [
  {
    path: 'logout',
      component: LogoutComponent,
  },
  {
    path: 'login',
      component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
