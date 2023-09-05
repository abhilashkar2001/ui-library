import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  originationId: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.originationId = this.data.originationId;
  }
  done() {
    this.dialogRef.close();
    this.router.navigate(["account/landing"]);
    //window.close();
  }
}
