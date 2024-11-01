import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DocumentUploadFormGroup } from "app/shared/helpers/docuemnt-upload.helper";
import { removeSpecCharsOnly } from "app/shared/helpers/utils";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanAccount } from "app/shared/models/loan-account.model";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { LoanInstallmentModel } from "app/shared/models/loan-installment.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-disbursment-request",
  templateUrl: "./disbursment-request.component.html",
  styleUrls: ["./disbursment-request.component.scss"],
})
export class DisbursmentRequestComponent
  extends DocumentUploadFormGroup
  implements OnInit {
  loanDetails: LoanDetailsModel[];
  _parentForm: FormGroup | undefined;
  installmentDetails: LoanInstallmentModel;
  selectedFiles: any;
  form: {
    name: any;
    documentId: any;
    documentName: any;
    documentType: any;
    documentSide: any;
    noOfSignatures: any;
    fileType: any;
    fileName: any;
    fileUrl: any;
  };
  profileInfo: any;
  currentCurrency: any;
  corpCustId: number;
  constructor(
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler
  ) {
    super(new FormBuilder());
  }

  ngOnInit(): void {
    this.loanDetails = this.sessionStorageService.getLoanInfo();
    this.corpCustId = this.sessionStorageService.getCustomerInfo()?.customerId;
    this.buildDisbursementRequestForm();
    if (this.loanDetails.length > 0) {
      this._parentForm
        .get("debitAccount")
        .setValue(this.loanDetails[0]?.cbsAccountNumber);
      this.onSelectionChange(this.loanDetails[0]?.cbsAccountNumber);
    }
  }

  buildDisbursementRequestForm() {
    this._parentForm = this.fb.group({
      debitAccount: ["", [Validators.required]],
      loanType: [""],
      chequeFavouringSame: ["", [Validators.required]],
      ownContribution: [false, [Validators.required]],
      payeeName: ["", [Validators.required]],
      specificDate: ["", [Validators.required]],
      debitAmount: [""],
      creditAmount: [""],
      transferDate: [""],
      purpose: [""],
      preferredDate: [""],
      remark: [""],
      acceptTermsConditions: ["", [Validators.required]],
      transferType: "Loan Disbursement",
      source: "I",
      documents: this.fb.array([]),
    });
    this.pushDocumentInfo();
  }

  addDocumentRow() {
    this.documentCtrl.push(this.documentFormArray());
  }

  deleteDocs(index: number) {
    this.documentCtrl.removeAt(index);
  }

  onSelectionChange(cbsAccountNumber: string) {
    const selectedAccount: LoanDetailsModel = this.loanDetails.find(
      (account) => account.cbsAccountNumber == cbsAccountNumber
    );
    this.fetchLoanInstallment();
    if (selectedAccount)
      this._parentForm.get("loanType").setValue(selectedAccount.accountType);
  }

  // fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this._parentForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
      });
  }

  onFileSelected(event, i) {
    this.selectedFiles = event.target.files;
    this.uploadDocument(i);
  }

  uploadDocument(index) {
    const processFile = (file, idx) => {
      let formData = new FormData();
      let data = {
        documentName: "91526",
        documentType: "",
        documentNumber: "",
        documentSide: 1,
        fileName: file.name,
        fileType: file.type,
        verificationType: "loan",
      };
      formData.append("data", JSON.stringify(data));
      formData.append("file", file);
      formData.append("module", "document");
      // this.kycService.uploadDocument(formData).subscribe((res) => {
      //   if ((res?.statusCode === 200 || res?.statusCode == 201) && res?.data) {
      //     this.form = {
      //       name: res?.data?.documentName,
      //       documentId: res?.data?.documentId,
      //       documentName: res?.data?.documentName,
      //       documentType: res?.data?.documentType,
      //       documentSide: res?.data?.documentSide,
      //       noOfSignatures: null,
      //       fileType: res?.data?.fileType,
      //       fileName: res?.data?.fileName,
      //       fileUrl: res?.data?.fileUrl
      //     };
      //     let dataArray = {
      //       fileName: file.name,
      //       fileUrl: res?.data?.fileUrl,
      //       documentId: res?.data?.documentId
      //     };
      //     this.documentFilesCtrl(index).push(
      //       this.documentFileFormArray(dataArray)
      //     );
      //     if (idx + 1 < this.selectedFiles.length) {
      //       processFile(this.selectedFiles[idx + 1], idx + 1);
      //     }
      //   } else {
      //     if (idx + 1 < this.selectedFiles.length) {
      //       processFile(this.selectedFiles[idx + 1], idx + 1);
      //     }
      //   }
      // });
    };
    if (this.selectedFiles.length > 0) {
      processFile(this.selectedFiles[0], 0);
    }
  }



  getDecimalValue(value: string) {
    return removeSpecCharsOnly(
      this.currentCurrency?.thousandsSeparator,
      value || 0
    );
  }


  //save function to save the details
  saveDisbursement() {
    let payload = {
      ...this._parentForm.value,
      debitAmount: this.getDecimalValue(this._parentForm.value.debitAmount),
    };
    payload.debitCurrency = this.loanDetails?.find(
      (res) => res?.cbsAccountNumber == this._parentForm?.value?.debitAccount
    )?.currencyCode;
    delete payload.tenure;
    let docs = [];
    payload?.documents.forEach((doc: any) => {
      if (doc?.files?.length > 0) {
        doc?.files?.forEach((file: any) => {
          docs.push(file?.documentId);
        });
      }
    });
    payload.documentIds = docs;
    delete payload?.documents;
    delete payload?.acceptTermsConditions;
    delete payload?.payeeName;
    delete payload?.ownContribution;
    delete payload?.chequeFavouringSame;
    delete payload?.loanType;
    4;
    console.log(payload, "loan-disbursment");

    let disburArr = [
      {
        eventType: "topUp",
        operationType: "Loan",
        status: "details",
        masterId: "benificiaryMasterId",
        statusHeader: "Confirm Details",
        statusNews: "Disbursment Request",
        summary: [
          {
            header: "Loan Details",
            details: [
              { Name: this.installmentDetails?.customerName },
              {
                "Loan Account Number":
                  this._parentForm?.get("debitAccount")?.value,
              },
              { Type: this._parentForm?.value?.loanType },
              { "Loan Amount": this.installmentDetails?.loanAmount },
            ],
          },
          {
            header: "Disbursement Requested",
            details: [
              { Amount: this._parentForm.value.debitAmount },
              { Purpose: this._parentForm.value.purpose },
              { "Preferred Date": this._parentForm.value.preferredDate },
              { Remark: this._parentForm.value.remark },
            ],
          },
          {
            header: "Cheque Detail",
            details: [
              { "Name of Payee": this._parentForm.value.payeeName },
              { "Specific Date": this._parentForm.value.specificDate },
            ],
          },
          {
            header: "Additional Information",
            details: [
              { "Upload Document": this._parentForm.value.documentName },
              { "Specific Date": this._parentForm.value.specificDate },
            ],
          },
        ],
      },
    ];
    this.serviceCallHandler.put(
      "serviceHandler",
      payload,
      disburArr,
      (payload) => this.loanService.saveService(payload)
    );
    this.router.navigate(["/user/loan/loan-service/payment-summary"]);
  }
}
