import { Component, Inject, OnInit } from "@angular/core";
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

@Component({
  selector: "app-bank-code-popup",
  templateUrl: "./bank-code-popup.component.html",
  styleUrls: ["./bank-code-popup.component.scss"]
})
export class BankCodePopupComponent implements OnInit {
  tableColumns: any = [];
  tableData: any = [];

  constructor(
    private dialogRef: MatDialogRef<BankCodePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.tableColumns = this.data?.tableColumns;
    this.tableData = this.data?.bankDetails;
  }

  onRowClicked(value) {
    this.dialogRef.close(value);
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
