import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-success-modal-popup',
  templateUrl: './success-modal-popup.component.html',
  styleUrls: ['./success-modal-popup.component.scss'],
})
export class SuccessModalPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<SuccessModalPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
