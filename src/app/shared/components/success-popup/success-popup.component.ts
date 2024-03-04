import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { DownloadService } from "app/shared/services/download.service";
import { EmailService } from "app/shared/services/email.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  originationId: any;
  email: any;
  loanSummaryDetails: any;
  accountData: any;
  fdRdDetails: any;
  depositType: any;
  isNetBanking: false;
  referenceNo: any = "";
  actionType: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public screenData: any,
    private emailService: EmailService,
    private downloadService: DownloadService,
    private openAccountService: OpenAccountService,
    private router: Router
  ) {
    this.isNetBanking = data.isNetBanking || false;
    this.actionType = data.actionType;
    this.referenceNo = data.refrenceNo;
    console.log(this.referenceNo);
  }
  ngOnInit(): void {
    this.depositType = this.data?.type;
    this.originationId = this.data?.originationId;
    this.email = this.data?.email;
    if (sessionStorage.getItem("loanBasisDetails")) {
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
    } else if (this.depositType) {
      downloadServiceMethod = this.downloadService.downloadFdRdDetailDoc(
        this.originationId
      );
      pdfFileName =
        this.depositType == "FD"
          ? "Fixed Deposit Details.pdf"
          : "Reccuring Deposit Details.pdf";
    }

    downloadServiceMethod.subscribe((resp: any) => {
      const blob = new Blob([resp], { type: "application/pdf" });

      report = new File([blob], pdfFileName, {
        type: "application/pdf",
      });

      if (event.operation == "Share") {
        formData.append("filePath", report, report.name);
        formData.append("subject", pdfFileName);
        formData.append(
          "body",
          `Automatic Generated ${pdfFileName}. Find above attach`
        );
        formData.append("to", this.email);
        this.emailService
          .triggerTransactionEmail(formData)
          .subscribe((res) => console.log(res));
      } else {
        const url = window.URL.createObjectURL(report);
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
    if (this.isNetBanking) {
      this.router.navigate([`/user/dashboard/${this.data.route}`]);
      this.dialogRef.close();
    } else {
      localStorage.removeItem("basisDetails");
      localStorage.removeItem("customerData");
      sessionStorage.removeItem("loanBasisDetails");
      this.dialogRef.close(true);
      window.close();
    }
  }
  close() {
    this.dialogRef.close(false);
  }
}
