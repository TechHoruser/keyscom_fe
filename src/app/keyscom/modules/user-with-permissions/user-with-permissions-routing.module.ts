import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserWithPermissionsMainComponent} from './components/main/user-with-permissions-main.component';

const routes: Routes = [
  {
    path: '',
    component: UserWithPermissionsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserWithPermissionsRoutingModule { }
