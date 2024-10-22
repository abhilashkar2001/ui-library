import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentUploadFormGroup } from 'app/shared/helpers/docuemnt-upload.helper';
import { LoanAccounts } from 'app/shared/models/loan-account.model';
import { LoanInstallmentModel } from 'app/shared/models/loan-installment.model';

@Component({
  selector: 'app-disbursment-request',
  templateUrl: './disbursment-request.component.html',
  styleUrls: ['./disbursment-request.component.scss']
})
export class DisbursmentRequestComponent
  extends DocumentUploadFormGroup
  implements OnInit {
  loanAccounts: LoanAccounts | undefined;
  _parentForm: FormGroup | undefined;
  customerId: any;
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
  constructor() {
    super(new FormBuilder());
  }

  ngOnInit(): void {
    this.buildDisbursementRequestForm()
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
      customerId: "",
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

  // onSelectionChange(cbsAccountNumber: string) {
  //   const selectedAccount: LoanAccount = this.loanAccounts.find(
  //     (account) => account.cbsAccountNumber == cbsAccountNumber
  //   );
  //   this.fetchLoanInstallment();
  //   if (selectedAccount)
  //     this._parentForm.get("loanType").setValue(selectedAccount.accountType);
  // }

  //fetch installment details
  // fetchLoanInstallment() {
  //   this.loanService
  //     .fetchLoanInstallment(this._parentForm?.value?.debitAccount)
  //     .subscribe((res: IcHttpResponseModel<LoanInstallmentModel>) => {
  //       if (res?.statusCode == 200 && res?.data)
  //         this.installmentDetails = res?.data;
  //     });
  // }

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
        verificationType: "loan"
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

}
