import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientMainComponent} from './components/main/client-main.component';
import {ClientCreateComponent} from './components/create/client-create.component';
import {ClientModifyComponent} from './components/modify/client-modify.component';

const routes: Routes = [
  {
    path: '',
    component: ClientMainComponent,
  },
  {
    path: 'create',
    component: ClientCreateComponent,
  },
  {
    path: `:uuid`,
    component: ClientModifyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
