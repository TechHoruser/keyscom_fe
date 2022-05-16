import {NgModule} from '@angular/core';
import {ClientListComponent} from './shared/list/client-list.component';
import {ClientMainComponent} from './components/main/client-main.component';
import {ClientCreateComponent} from './components/create/client-create.component';
import {SharedModule} from '../shared/shared.module';
import {ClientModifyComponent} from './components/modify/client-modify.component';
import {UserWithPermissionsModule} from '../user-with-permissions/user-with-permissions.module';
import {ClientSelectListComponent} from './shared/select-list/client-select-list.component';

@NgModule({
  declarations: [
    ClientListComponent,
    ClientMainComponent,
    ClientCreateComponent,
    ClientModifyComponent,
    ClientSelectListComponent,
  ],
  imports: [
    SharedModule,
    UserWithPermissionsModule,
  ],
  exports: [
    ClientSelectListComponent
  ]
})

export class ClientModule {}
