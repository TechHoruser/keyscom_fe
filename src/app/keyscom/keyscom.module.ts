import {NgModule} from '@angular/core';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {DashboardModule} from './modules/dashboard/dashboard.module';

@NgModule({
  imports: [
    DashboardModule,
    UserModule,
    AuthModule,
  ],
  exports: [
    KeyscomRoutingModule,
  ],
})
export class KeyscomModule {}
