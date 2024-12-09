import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"]
})
export class SuccessPopupComponent implements OnInit {
  depositId: any;
  constructor(private dialogRef: MatDialogRef<SuccessPopupComponent>) {}

  ngOnInit(): void {
    this.depositId = parseInt(
      <string>sessionStorage.getItem("depositOriginationId")
    );
  }
  done() {
    this.dialogRef.close();
    window.close();
  }
}
