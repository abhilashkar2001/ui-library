import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "app-savings-submit-dialog",
  templateUrl: "./savings-submit-dialog.component.html",
  styleUrls: ["./savings-submit-dialog.component.scss"],
})
export class SavingsSubmitDialogComponent implements OnInit {
  header: any;
  applicationNo: any;
  @Output() submitClicked = new EventEmitter<any>();
  @Output() goBack = new EventEmitter<any>();

  constructor(
    private dialogRef: MatDialogRef<SavingsSubmitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.applicationNo = this.data?.applicationNo;
  }

  close() {
    this.dialogRef.close();
  }
  
  done() {
    if (this.data.flow && this.data.flow === "cards") {
      this.router.navigate(["/cards"]);
    } else if (this.data.flow === "loans") {
      this.router.navigate(["/loans"]);
    } else {
      this.router.navigate(["/"]);
    }
    this.close();
  }
}
