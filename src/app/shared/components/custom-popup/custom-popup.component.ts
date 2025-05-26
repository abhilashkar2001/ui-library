import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.scss'],
})
export class CustomPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<CustomPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
  ) {}

  close(): void {
    this.dialogRef.close();
  }
}
