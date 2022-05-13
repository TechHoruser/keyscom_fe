import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserMainComponent} from './components/main/user-main.component';
import {UserCreateComponent} from './components/create/user-create.component';
import {UserModifyComponent} from './components/modify/user-modify.component';

const routes: Routes = [
  {
    path: '',
    component: UserMainComponent,
  },
  {
    path: 'create',
    component: UserCreateComponent,
  },
  {
    path: `:uuid`,
    component: UserModifyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
