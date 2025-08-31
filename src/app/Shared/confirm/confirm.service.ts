import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmData } from './confirm-dialog.component';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  private dialog = inject(MatDialog);

  open(data: ConfirmData, config?: MatDialogConfig): Observable<boolean> {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      autoFocus: false,
      data,
      ...config
    });
    return ref.afterClosed().pipe(map(v => !!v));
  }
}
