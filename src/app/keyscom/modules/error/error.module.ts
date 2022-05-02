import {NgModule} from '@angular/core';
import {InternalErrorComponent} from './components/internal-error/internal-error.component';
import {SharedModule} from '../shared/shared.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorInterceptor} from './services/error.interceptor';

@NgModule({
  declarations: [
    InternalErrorComponent,
  ],
  imports: [
    SharedModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  exports: [
  ],
})

export class ErrorModule {}
