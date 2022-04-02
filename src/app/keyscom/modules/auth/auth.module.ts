import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {LogoutComponent} from './component/logout/logout.component';
import {CallbackComponent} from './component/callback/callback.component';
import {SharedModule} from '../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
    CallbackComponent,
  ],
  exports: [
    AuthRoutingModule,
  ],
  imports: [
    SharedModule,
  ],
})
export class AuthModule {}