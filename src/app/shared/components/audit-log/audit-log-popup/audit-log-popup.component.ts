import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-audit-log-popup",
  templateUrl: "./audit-log-popup.component.html",
  styleUrls: ["./audit-log-popup.component.scss"],
})
export class AuditLogPopupComponent implements OnInit {
  isShowCancel: any;
  dummyData: any;
  columns: any;
  auditData;

  constructor(
    private dialogRef: MatDialogRef<AuditLogPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private auditLogData: any
  ) {}

  ngOnInit(): void {
    this.auditData = this.auditLogData;
  }
  customExpand(event) {
    this.dialogRef.close();
  }
}
