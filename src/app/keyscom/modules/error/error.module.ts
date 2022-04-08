import {NgModule} from '@angular/core';
import {ErrorMainComponent} from './components/main/error-main.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    ErrorMainComponent,
  ],
  imports: [
    SharedModule,
  ],
})

export class ErrorModule {}
