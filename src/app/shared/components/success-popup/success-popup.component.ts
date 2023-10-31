import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DownloadService } from "app/shared/services/download.service";
import { EmailService } from "app/shared/services/email.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  depositType: any;
  originationId: any;
  email: any;
  loanSummaryDetails: any;
  accountData: any;
  fdRdDetails: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public screenData: any,
    private emaiService: EmailService,
    private downloadService: DownloadService,
    private openAccountService: OpenAccountService
  ) {}
  ngOnInit(): void {
    this.depositType = this.data?.type;
    this.originationId = this.data?.originationId;
    if (localStorage.getItem("customerData")) {
      this.openAccountService.getData().subscribe((resp: any) => {
        if (resp) {
          this.loanSummaryDetails = resp;
          this.email = resp.email;
        }
      });
    } else if (localStorage.getItem("basisDetails")) {
      this.openAccountService.getData().subscribe((res: any) => {
        if (res) {
          this.accountData = res;
          this.email = this.accountData.contact.email;
        }
      });
    } else if (this.depositType) {
      this.openAccountService.getData().subscribe((res: any) => {
        if (res) {
          this.fdRdDetails = res[0];
          this.email = res[0].contact.email;
        }
      });
    }
  }

  onClickAction(type, operation) {
    this.shareOrDownload({ type: type, operation: operation });
  }

  shareOrDownload(event) {
    const formData = new FormData();
    let report;
    let downloadServiceMethod;
    let pdfFileName;

    if (this.loanSummaryDetails) {
      downloadServiceMethod = this.downloadService.downloadloanDetailDoc(
        this.originationId
      );
      pdfFileName = "Loan Details.pdf";
    } else if (this.accountData) {
      downloadServiceMethod = this.downloadService.downloadAccountDetailDoc(
        this.originationId
      );
      pdfFileName = "Account Details.pdf";
    } else if (this.fdRdDetails) {
      downloadServiceMethod = this.downloadService.downloadFdRdDetailDoc(
        this.originationId
      );
      pdfFileName =
        this.depositType == "FD"
          ? "Fixed Deposit Details"
          : "Reccuring Deposit Details";
    }

    downloadServiceMethod.subscribe((resp: ArrayBuffer) => {
      const blob = new Blob([resp], { type: "application/pdf" });

      report = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      if (event.operation == "Share") {
        formData.append("filePath", report, report.name);
        formData.append("subject", pdfFileName);
        formData.append(
          "body",
          `Automatic Generated ${pdfFileName}. Find below attach`
        );
        formData.append("to", this.email);
        this.emaiService
          .triggerTransactionEmail(formData)
          .subscribe((res) => console.log(res));
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = pdfFileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  done() {
    localStorage.removeItem("basisDetails");
    localStorage.removeItem("customerData");
    this.dialogRef.close(true);
    window.close();
  }
  close() {
    this.dialogRef.close(false);
  }
}
