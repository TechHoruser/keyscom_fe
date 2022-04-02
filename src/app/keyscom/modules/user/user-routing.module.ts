import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserMainComponent} from './components/main/user-main.component';
import {UserCreateComponent} from './components/create/user-create.component';

const routes: Routes = [
  {
    path: '',
    component: UserMainComponent,
  },
  {
    path: 'create',
    component: UserCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
