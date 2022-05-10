import {NgModule} from '@angular/core';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {ClientModule} from './modules/client/client.module';
import {DialogModule} from './modules/dialog/dialog.module';
import {ProjectModule} from './modules/project/project.module';
import {MachineModule} from './modules/machine/machine.module';
import {LayoutModule} from './modules/layout/layout.module';
import {ErrorModule} from './modules/error/error.module';
import {ProfileModule} from './modules/profile/profile.module';

@NgModule({
  imports: [
    DashboardModule,
    UserModule,
    ClientModule,
    ProjectModule,
    MachineModule,
    AuthModule,
    DialogModule,
    LayoutModule,
    ErrorModule,
    ProfileModule,
  ],
  exports: [
    KeyscomRoutingModule,
  ],
})
export class KeyscomModule {}
