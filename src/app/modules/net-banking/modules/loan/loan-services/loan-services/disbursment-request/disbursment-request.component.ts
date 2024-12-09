import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { DocumentUploadFormGroup } from "app/shared/helpers/docuemnt-upload.helper";
import { removeSpecCharsOnly } from "app/shared/helpers/utils";
import { IcHttpResponseModel } from "app/shared/models/ic-http-response.model";
import { LoanDetailsModel } from "app/shared/models/loan-details.model";
import { LoanInstallmentModel } from "app/shared/models/loan-installment.model";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { CommonService } from "app/shared/services/common-service/common.service";
import { GenericValueService } from "app/shared/services/generic-value.service";
import { LoanService } from "app/shared/services/net-loan-service/loan.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";

@Component({
  selector: "app-disbursment-request",
  templateUrl: "./disbursment-request.component.html",
  styleUrls: ["./disbursment-request.component.scss"]
})
export class DisbursmentRequestComponent
  extends DocumentUploadFormGroup
  implements OnInit
{
  loanDetails: LoanDetailsModel[] | any;
  override _parentForm!: FormGroup;
  installmentDetails: LoanInstallmentModel | any;
  selectedFiles: any;
  form:
    | {
        name: any;
        documentId: any;
        documentName: any;
        documentType: any;
        documentSide: any;
        noOfSignatures: any;
        fileType: any;
        fileName: any;
        fileUrl: any;
      }
    | any;
  profileInfo: any;
  currentCurrency: any;
  corpCustId: number | any;
  genericValue: any = { DOCUMENTTYPE: [] };
  constructor(
    private loanService: LoanService,
    private sessionStorageService: SessionStorageService,
    private router: Router,
    private serviceCallHandler: ServiceCallHandler,
    private genericValueService: GenericValueService,
    private commonService: CommonService
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
        ?.setValue(this.loanDetails[0]?.cbsAccountNumber);
      this.onSelectionChange(this.loanDetails[0]?.cbsAccountNumber);
    }
    this.fetchGenericValues();
  }

  //fetch generic values
  fetchGenericValues() {
    this.genericValueService
      .loadGenericValue("Common", Object.keys(this.genericValue))
      .subscribe((res: any) => {
        if (res?.statusCode === 200 && res?.data) {
          Object.keys(res?.data).forEach(
            (k) => (this.genericValue[k] = res.data[k])
          );
        }
      });
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
      corpCustomerId: this.corpCustId,
      documents: this.fb.array([])
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
      (account: any) => account.cbsAccountNumber == cbsAccountNumber
    );
    this.fetchLoanInstallment();
    if (selectedAccount)
      this._parentForm.get("loanType")?.setValue(selectedAccount.accountType);
  }

  // fetch installment details
  fetchLoanInstallment() {
    this.loanService
      .fetchLoanInstallment(this._parentForm?.value?.debitAccount)
      .subscribe((res: IcHttpResponseModel<LoanInstallmentModel> | any) => {
        if (res?.statusCode == 200 && res?.data)
          this.installmentDetails = res?.data;
        this._parentForm
          .get("payeeName")
          ?.setValue(this.installmentDetails?.customerName);
        this._parentForm
          .get("creditAmount")
          ?.setValue(this.installmentDetails?.loanAmount);
      });
  }

  /**
   * Multiple files can able to upload
   * @param event
   * @param i
   */
  onFileSelected(event: any, i: any) {
    this.selectedFiles = event.target.files;
    Array.from(this.selectedFiles).forEach((file) => {
      this.uploadDocument(file, i);
    });
  }

  /**
   * Upload document method
   * @param file
   * @param i
   */
  uploadDocument(file: any, i: any) {
    const docdata: any = {
      fileName: file.name.split(".")[0],
      fileType: file.type.split("/")[1],
      documentSide: 1
    };

    // Prepare FormData for each file
    const formdata = new FormData();
    formdata.append("file", file);
    formdata.append("data", JSON.stringify(docdata));
    formdata.append("module", "document");

    this.commonService.uploadDocument(formdata).subscribe((res: any) => {
      if ((res?.statusCode === 200 || res?.statusCode === 201) && res?.data) {
        const uploadedFile = {
          fileName: file.name,
          fileUrl: res.data.fileUrl || "",
          documentId: res.data.documentId || null
        };
        const filesArray = this.documentCtrl.controls[i].get(
          "files"
        ) as FormArray;
        filesArray.push(this.fb.group(uploadedFile));
      }
    });
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
      debitAmount: this.getDecimalValue(this._parentForm.value.debitAmount)
    };
    payload.debitCurrency = this.loanDetails?.find(
      (res: any) =>
        res?.cbsAccountNumber == this._parentForm?.value?.debitAccount
    )?.currencyCode;
    delete payload.tenure;
    let docs: any = [];
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

    let disburArr = [
      {
        eventType: "disbursmentReq",
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
                  this._parentForm?.get("debitAccount")?.value
              },
              { Type: this._parentForm?.value?.loanType },
              { "Loan Amount": this.installmentDetails?.loanAmount }
            ]
          },
          {
            header: "Disbursement Requested",
            details: [
              { Amount: this._parentForm?.value.debitAmount },
              { Purpose: this._parentForm?.value.purpose },
              { "Preferred Date": this._parentForm?.value.preferredDate },
              { Remark: this._parentForm?.value.remark }
            ]
          },
          {
            header: "Cheque Detail",
            details: [
              { "Name of Payee": this._parentForm?.value.payeeName },
              { "Specific Date": this._parentForm?.value.specificDate }
            ]
          },
          {
            header: "Additional Information",
            details: [
              { "Upload Document": this._parentForm?.value.documentName },
              { "Specific Date": this._parentForm?.value.specificDate }
            ]
          }
        ]
      }
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
