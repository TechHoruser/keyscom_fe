import {NgModule} from '@angular/core';
import {KeyscomRoutingModule} from './keyscom-routing.module';
import {UserModule} from './modules/user/user.module';
import {AuthModule} from './modules/auth/auth.module';
import {DashboardModule} from './modules/dashboard/dashboard.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './modules/auth/services/jwt.interceptor';
import {ErrorInterceptor as ErrorInterceptorUnauthorized} from './modules/auth/services/error.interceptor';
import {ErrorInterceptor as ErrorInterceptorInternalServer} from './modules/error/services/error.interceptor';
import {ClientModule} from './modules/client/client.module';
import {DialogModule} from './modules/dialog/dialog.module';
import {ProjectModule} from './modules/project/project.module';
import {MachineModule} from './modules/machine/machine.module';
import {LoaderInterceptor} from './modules/dashboard/services/loader.interceptor';

@NgModule({
  imports: [
    DashboardModule,
    UserModule,
    ClientModule,
    ProjectModule,
    MachineModule,
    AuthModule,
    DialogModule,
  ],
  exports: [
    KeyscomRoutingModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorUnauthorized,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptorInternalServer,
      multi: true,
    },
  ],
})
export class KeyscomModule {}
