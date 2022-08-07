import {NgModule} from '@angular/core';
import {SharedModule} from '../shared/shared.module';
import {LayoutComponent} from './components/layout/layout.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {LoaderInterceptor} from './services/loader.interceptor';
import {AlertComponent} from './components/alert/alert.component';

@NgModule({
  declarations: [
    LayoutComponent,
    AlertComponent,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    },
  ],
  exports: [
    LayoutComponent,
    AlertComponent,
  ]
})

export class LayoutModule {}
