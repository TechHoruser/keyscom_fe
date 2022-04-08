import {NgModule} from '@angular/core';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {SharedModule} from '../shared/shared.module';
import {ConfirmDialogService} from './services/confirm-dialog.service';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ConfirmDialogComponent,
  ],
  exports: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent],
  providers: [ConfirmDialogService]
})
export class DialogModule {}
