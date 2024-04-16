import { Component, Inject, OnInit } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from "@angular/material/dialog";

@Component({
  selector: "app-reusable-alert-popup",
  templateUrl: "./reusable-alert-popup.component.html",
  styleUrls: ["./reusable-alert-popup.component.scss"],
})
export class ReusableAlertPopupComponent implements OnInit {
  message: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ReusableAlertPopupComponent>
  ) {}

  ngOnInit(): void {
    this.message = this.data?.msg;
  }

  done() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }
}
