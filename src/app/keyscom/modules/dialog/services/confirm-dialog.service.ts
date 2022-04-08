import {Injectable} from '@angular/core';
import {map, Observable, take} from 'rxjs';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Injectable()
export class ConfirmDialogService {
  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private dialog: MatDialog,
  ) {}

  public open(options): void
  {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => {
        return res;
      }
    ));
  }
}
