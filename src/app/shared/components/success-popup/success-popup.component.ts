import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DownloadService } from "app/shared/services/download.service";
import { EmailService } from "app/shared/services/email.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SuccessPopupConstants } from "./success-popup.constant";
@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  originationId: any;
  accountHeader = SuccessPopupConstants.ACCOUNT_HEADER;
  suiteHeader = SuccessPopupConstants.SUIT_HEADER;
  email: any;
  loanSummaryDetails: any;
  accountData: any;
  constructor(
    private dialogRef: MatDialogRef<SuccessPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any,
    @Inject(MAT_DIALOG_DATA) public screenData: any,
    private emaiService: EmailService,
    private downloadService: DownloadService,
    private openAccountService: OpenAccountService
  ) {}
  ngOnInit(): void {
    this.originationId = this.data?.originationId;
    if (localStorage.getItem("customerData")) {
      this.openAccountService.getData().subscribe((resp: any) => {
        if (resp) {
          this.loanSummaryDetails = resp;
          this.email = resp.email;
        }
      });
    } else {
      this.openAccountService.getData().subscribe((res: any) => {
        if (res) {
          this.accountData = res;
          this.email = this.accountData.contact.email;
        }
      });
    }
  }
  download() {
    const downloadServiceMethod = this.loanSummaryDetails
      ? this.downloadService.downloadloanDetailDoc(this.originationId)
      : this.downloadService.downloadAccountDetailDoc(this.originationId);
    downloadServiceMethod.subscribe((resp: ArrayBuffer) => {
      this.downloadPdf(resp);
    });
  }
  private downloadPdf(data: ArrayBuffer) {
    const blob = new Blob([data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.pdf";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  sendEmail() {
    const doc = new jsPDF();
    const head = this.loanSummaryDetails
      ? [this.suiteHeader]
      : [this.accountHeader];
    const body = [];
    const row = [];
    row.push(this.originationId);

    if (this.loanSummaryDetails) {
      const loanDetails = this.loanSummaryDetails.loanDetails;
      row.push(this.loanSummaryDetails.bankAccount.name);
      row.push(loanDetails.loanAmount);
      row.push(loanDetails.emiAmount);
      row.push(loanDetails.interestPayable);
    } else {
      row.push(this.accountData.firstName);
      row.push(this.accountData.lastName);
      row.push(sessionStorage.getItem("mobileNo"));
      row.push(this.accountData.kycStatus);
    }

    body.push(row);
    autoTable(doc, {
      head: head,
      body: body,
      didDrawCell: (prepare) => {},
    });

    const formData = new FormData();
    const subject = this.loanSummaryDetails
      ? "Loan Details Slip"
      : "Account Details Slip";
    formData.append("subject", subject);
    formData.append(
      "body",
      `Automatic Generated ${subject}. Find below attach`
    );
    formData.append("to", this.email);
    const pdfBlob = doc.output("blob");
    const pdfFileName = this.loanSummaryDetails
      ? "Loan Details.pdf"
      : "Account Details.pdf";
    const pdfFile = new File([pdfBlob], pdfFileName, {
      type: "application/pdf",
    });
    formData.append("filePath", pdfFile, pdfFileName);
    this.emaiService.triggerTransactionEmail(formData).subscribe((res) => {
      console.log(res);
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
