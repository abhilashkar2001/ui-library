import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-select-single-transfer',
  templateUrl: './select-single-transfer.component.html',
  styleUrls: ['./select-single-transfer.component.scss'],
})
export class SelectSingleTransferComponent {
  checkToggle = true;

  constructor(private dialogRef: MatDialogRef<SelectSingleTransferComponent>) {}

  customerToggle(event: any) {
    this.checkToggle = event;
  }
  onSubmit() {
    this.dialogRef.close(this.checkToggle);
  }

  onBack() {
    this.dialogRef.close('Cancel');
  }
}
