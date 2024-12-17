import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { AppComfirmComponent } from './app-confirm.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

interface confirmData {
  title?: string;
  message?: string;
}

@Injectable()
export class AppConfirmService {
  constructor(
    private dialog: MatDialog,
    private matDialogRef: MatDialogRef<AppComfirmComponent>,
  ) {}

  public confirm(data: confirmData = {}): Observable<boolean> {
    data.title = data.title || 'Confirm';
    data.message = data.message || 'Are you sure?';
    this.matDialogRef = this.dialog.open(AppComfirmComponent, {
      width: '380px',
      disableClose: true,
      data: { title: data.title, message: data.message },
    });
    return this.matDialogRef.afterClosed();
  }
}
