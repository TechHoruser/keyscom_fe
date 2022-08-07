import {NgModule} from '@angular/core';
import {LoginComponent} from './component/login/login.component';
import {LogoutComponent} from './component/logout/logout.component';
import {SharedModule} from '../shared/shared.module';
import {AuthRoutingModule} from './auth-routing.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {JwtInterceptor} from './services/jwt.interceptor';
import {UnauthorizedInterceptor} from './services/unauthorized.interceptor';
import {LayoutModule} from '../layout/layout.module';

@NgModule({
  declarations: [
    LoginComponent,
    LogoutComponent,
  ],
  exports: [
    AuthRoutingModule,
  ],
  imports: [
    SharedModule,
    LayoutModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true,
    },
  ],
})
export class AuthModule {}
