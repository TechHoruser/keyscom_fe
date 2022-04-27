import {Injectable} from '@angular/core';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable()
export class ConfirmDialogService {
  constructor(
    private dialog: MatDialog,
  ) {}

  public open(options, confirmFunction: CallableFunction = () => {}): void
  {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    })
    .afterClosed()
    .subscribe((confirmed: boolean) => {
      if (confirmed) {
        confirmFunction();
      }
    });
  }
}
