import {NgModule} from '@angular/core';
import {MachineListComponent} from './shared/list/machine-list.component';
import {MachineMainComponent} from './components/main/machine-main.component';
import {MachineCreateComponent} from './components/create/machine-create.component';
import {SharedModule} from '../shared/shared.module';
import {MachineModifyComponent} from './components/modify/machine-modify.component';
import {UserWithPermissionsModule} from '../user-with-permissions/user-with-permissions.module';
import {ClientModule} from '../client/client.module';
import {ProjectModule} from '../project/project.module';

@NgModule({
  declarations: [
    MachineListComponent,
    MachineMainComponent,
    MachineCreateComponent,
    MachineModifyComponent,
  ],
  imports: [
    SharedModule,
    UserWithPermissionsModule,
    ClientModule,
    ProjectModule,
  ],
})

export class MachineModule {}
