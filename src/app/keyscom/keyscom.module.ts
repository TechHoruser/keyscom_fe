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
import {MatPaginatorIntl} from '@angular/material/paginator';
import {TranslateService} from '@ngx-translate/core';
import {PaginatorI18n} from './modules/shared/services/paginator-i18n';

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
    {
      provide: MatPaginatorIntl, deps: [TranslateService],
      useFactory: () => new PaginatorI18n().getPaginatorIntl()
    },
  ],
})
export class KeyscomModule {}
