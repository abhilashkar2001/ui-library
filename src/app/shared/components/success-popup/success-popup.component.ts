import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { PdfDownloadServiceService } from "app/shared/services/pdf-download-service.service";

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
    private pdfDownload: PdfDownloadServiceService
  ) {}

  ngOnInit(): void {
    this.originationId = this.data?.originationId;
  }
  done() {
    localStorage.removeItem("basisDetails");
    sessionStorage.removeItem("customerId");
    this.dialogRef.close(true);
    window.close();
  }
  close() {
    this.dialogRef.close(false);
  }
  download(actionType) {
    if (this.data?.type === "loan")
      this.pdfDownload.Excel(
        this.data,
        "loan Account",
        this.data.customHeader,
        actionType
      );
  }
}
