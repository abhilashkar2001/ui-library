import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DownloadService } from "app/shared/services/download.service";
import { EmailService } from "app/shared/services/email.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { PdfDownloadServiceService } from "app/shared/services/pdf-download-service.service";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
@Component({
  selector: "app-success-popup",
  templateUrl: "./success-popup.component.html",
  styleUrls: ["./success-popup.component.scss"],
})
export class SuccessPopupComponent implements OnInit {
  originationId: any;
  suiteHeader = [
    "Application No",
    "Name",
    "Loan Amount",
    "Emi Amount",
    "Interest Payable",
  ];
  accountHeader = [
    "Application No",
    "First Name",
    "Last Name",
    "Mobile",
    "KYC Status",
  ];
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
    console.log("Loan Data", this.loanSummaryDetails);
    console.log("Account Data", this.accountData);
    console.log("DOB", this.accountData.dateOfBirth);
  }
  download() {
    if (this.loanSummaryDetails) {
      this.downloadService
        .downloadloanDetailDoc(this.originationId)
        .subscribe((resp: ArrayBuffer) => {
          const blob = new Blob([resp], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "document.pdf";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
    } else {
      this.downloadService
        .downloadAccountDetailDoc(this.originationId)
        .subscribe((resp: ArrayBuffer) => {
          const blob = new Blob([resp], { type: "application/pdf" });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "document.pdf";
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
        });
    }
  }
  sendEmail() {
    if (this.loanSummaryDetails) {
      let doc = new jsPDF();
      const head: any = [this.suiteHeader];
      const body = [];
      var row = [];
      row.push(this.originationId);
      row.push(this.loanSummaryDetails.bankAccount.name);
      row.push(this.loanSummaryDetails.loanDetails.loanAmount);
      row.push(this.loanSummaryDetails.loanDetails.emiAmount);
      row.push(this.loanSummaryDetails.loanDetails.interestPayable);
      body.push(row);
      autoTable(doc, {
        head: head,
        body: body,
        didDrawCell: (prepare) => {},
      });

      const formData = new FormData();
      formData.append("subject", "Loan Details Slip");
      formData.append(
        "body",
        "Automatic Generated Loan Details. Find below attach"
      );
      formData.append("to", this.email);
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], "Loan Details.pdf", {
        type: "application/pdf",
      });
      formData.append("filePath", pdfFile, pdfFile.name);
      console.log(formData);
      this.emaiService
        .triggerTransactionEmail(formData)
        .subscribe((res) => console.log(res));
    } else {
      let doc = new jsPDF();
      const head: any = [this.accountHeader];
      const body = [];
      var row = [];
      row.push(this.originationId);
      row.push(this.accountData.firstName);
      row.push(this.accountData.lastName);
      row.push(sessionStorage.getItem("mobileNo"));
      row.push(this.accountData.kycStatus);
      body.push(row);
      autoTable(doc, {
        head: head,
        body: body,
        didDrawCell: (prepare) => {},
      });

      const formData = new FormData();
      formData.append("subject", "Account Details Slip");
      formData.append(
        "body",
        "Automatic Generated Account Details. Find below attach"
      );
      formData.append("to", this.email);
      const pdfBlob = doc.output("blob");
      const pdfFile = new File([pdfBlob], "Account Details.pdf", {
        type: "application/pdf",
      });
      formData.append("filePath", pdfFile, pdfFile.name);
      console.log(formData);
      this.emaiService
        .triggerTransactionEmail(formData)
        .subscribe((res) => console.log(res));
    }
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
