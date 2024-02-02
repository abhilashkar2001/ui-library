import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-error-notifier-popup",
  templateUrl: "./error-notifier-popup.component.html",
  styleUrls: ["./error-notifier-popup.component.scss"],
})
export class ErrorNotifierPopupComponent implements OnInit {
  errorMessage: string = "";
  errorMessageHint: string = "";

  constructor(
    private dialogRef: MatDialogRef<ErrorNotifierPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.errorMessage = this.data.errorMessage;
    this.errorMessageHint = this.data?.errorMessageHint ?? "";
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
