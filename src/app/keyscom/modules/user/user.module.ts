import {NgModule} from '@angular/core';
import {UserListComponent} from './shared/list/user-list.component';
import {UserMainComponent} from './components/main/user-main.component';
import {UserCreateComponent} from './components/create/user-create.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    UserListComponent,
    UserMainComponent,
    UserCreateComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class UserModule {}
