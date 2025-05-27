import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss'],
})
export class CustomPopupComponent {
  constructor(public dialogRef: MatDialogRef<CustomPopupComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
