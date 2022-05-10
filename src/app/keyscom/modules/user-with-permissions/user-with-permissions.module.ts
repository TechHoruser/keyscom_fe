import {NgModule} from '@angular/core';
import {UserWithPermissionsMainComponent} from './components/main/user-with-permissions-main.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    UserWithPermissionsMainComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: [
    UserWithPermissionsMainComponent
  ]
})

export class UserWithPermissionsModule {}
