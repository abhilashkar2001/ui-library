import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-reusable-alert-popup",
  templateUrl: "./reusable-alert-popup.component.html",
  styleUrls: ["./reusable-alert-popup.component.scss"],
})
export class ReusableAlertPopupComponent implements OnInit {
  message: any;
  isNextButton: boolean = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ReusableAlertPopupComponent>
  ) {}

  ngOnInit(): void {
    this.message = this.data?.msg;
    if (this.data?.isNextButton) this.isNextButton = this.data.isNextButton;
  }

  done() {
    this.dialogRef.close(true);
  }

  cancel() {
    this.dialogRef.close();
  }
}
