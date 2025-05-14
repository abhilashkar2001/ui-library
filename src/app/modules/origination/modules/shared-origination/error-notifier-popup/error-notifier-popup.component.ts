import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-error-notifier-popup',
  templateUrl: './error-notifier-popup.component.html',
  styleUrls: ['./error-notifier-popup.component.scss'],
})
export class ErrorNotifierPopupComponent implements OnInit {
  errorMessage = '';
  errorMessageHint = '';
  isStageAvilable = true;
  showCancelBtn = false;
  showOkBtn = false;

  constructor(
    private dialogRef: MatDialogRef<ErrorNotifierPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
  ) {}

  ngOnInit(): void {
    this.errorMessage = this.data.errorMessage;
    this.errorMessageHint = this.data?.errorMessageHint ?? '';
    this.isStageAvilable = this.data?.isStageAvilable ?? true;
    this.showCancelBtn = this.data?.showCancelBtn ? true : false;
    this.showOkBtn = this.data?.showOkBtn ? false : true;
  }

  closeDialog() {
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close('cancel');
  }
}
