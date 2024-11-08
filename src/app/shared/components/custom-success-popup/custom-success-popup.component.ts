import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-custom-success-popup",
  templateUrl: "./custom-success-popup.component.html",
  styleUrls: ["./custom-success-popup.component.scss"],
})
export class CustomSuccessPopupComponent implements OnInit {
  @Output() doneEmit = new EventEmitter<any>();
  message: any;
  status: any;
  referenceNo: any;
  constructor(
    private dialogRef: MatDialogRef<CustomSuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    if (this.data) {
      this.message = this.data.msg;
      this.status = this.data.status;
      this.referenceNo = this.data?.reffNo;
    }
  }

  done(status) {
    this.doneEmit.emit(status);
    this.dialogRef.close(status);
  }
}
