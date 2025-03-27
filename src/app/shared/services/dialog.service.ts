import { Injectable, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(
    component: Type<any>,
    width: string,
    data: any,
    disableClose: boolean,
    panelClass: string,
  ) {
    const dialogRef = this.dialog.open(component, {
      width: width,
      data: data,
      disableClose: disableClose,
      panelClass: panelClass,
    });
    return dialogRef.afterClosed();
  }
}
