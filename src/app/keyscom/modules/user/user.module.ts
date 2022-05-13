import {NgModule} from '@angular/core';
import {UserListComponent} from './shared/list/user-list.component';
import {UserMainComponent} from './components/main/user-main.component';
import {UserCreateComponent} from './components/create/user-create.component';
import {SharedModule} from '../shared/shared.module';
import {UserModifyComponent} from './components/modify/user-modify.component';

@NgModule({
  declarations: [
    UserListComponent,
    UserMainComponent,
    UserCreateComponent,
    UserModifyComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class UserModule {}
