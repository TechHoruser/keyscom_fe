import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MachineMainComponent} from './components/main/machine-main.component';
import {MachineCreateComponent} from './components/create/machine-create.component';
import {MachineModifyComponent} from './components/modify/machine-modify.component';

const routes: Routes = [
  {
    path: '',
    component: MachineMainComponent,
  },
  {
    path: 'create',
    component: MachineCreateComponent,
  },
  {
    path: `:uuid`,
    component: MachineModifyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MachineRoutingModule { }
