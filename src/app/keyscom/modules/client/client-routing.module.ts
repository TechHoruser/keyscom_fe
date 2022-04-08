import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ClientMainComponent} from './components/main/client-main.component';
import {ClientCreateComponent} from './components/create/client-create.component';

const routes: Routes = [
  {
    path: '',
    component: ClientMainComponent,
  },
  {
    path: 'create',
    component: ClientCreateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
