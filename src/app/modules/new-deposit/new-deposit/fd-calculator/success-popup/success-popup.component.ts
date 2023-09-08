import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  depositId: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    this.depositId = parseInt(sessionStorage.getItem("recurringDepositId"));
  }
  done() {
    this.dialogRef.close();
    window.close();
  }
}
