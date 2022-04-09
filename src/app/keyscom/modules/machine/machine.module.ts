import {NgModule} from '@angular/core';
import {MachineListComponent} from './shared/list/machine-list.component';
import {MachineMainComponent} from './components/main/machine-main.component';
import {MachineCreateComponent} from './components/create/machine-create.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    MachineListComponent,
    MachineMainComponent,
    MachineCreateComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class MachineModule {}
