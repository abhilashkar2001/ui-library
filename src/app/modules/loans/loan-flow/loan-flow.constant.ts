import { CommonPersonalDetailsComponent } from "app/shared/components/common-personal-details/common-personal-details.component";
import { CommonMobileVerificationComponent } from "app/shared/components/comon-mobile-verification/common-mobile-verification.component";
import { OtherDocumentsComponent } from "app/shared/components/other-documents/other-documents.component";
import { CreateLoanComponent } from "../create-loan/create-loan.component";
import { CibilScoreContainerComponent } from "../cibil-score-container/cibil-score-container.component";
import { LoanDocumentUploadComponent } from "../loan-document-upload/loan-document-upload.component";
import { LoanTermsConditionsComponent } from "../loan-terms-conditions/loan-terms-conditions.component";
import { LoanSummaryComponent } from "../loan-summary/loan-summary.component";
import { NationalIdUploadComponent } from "../national-id-upload/national-id-upload.component";

export class LoanFlowConstants {
  static readonly CUSTOM_HEADER = [
    {
      title: "Loan Details",
      headerKey: "loanDetails",
      headerInfo: [
        { header: "loan Ammount", headKey: "loanAmount" },
        { header: "Tenure", headKey: "loanTenure" },
        { header: "EMI Ammount", headKey: "emiAmount" },
        { header: "Interest Rate", headKey: "interestRate" },
        { header: "Interest Paybale", headKey: "interestPayable" },
        { header: "Principle Ammount", headKey: "principalAmount" },
        { header: "Total Payable Ammount", headKey: "totalPayableAmount" },
        { header: "Holder Type", headKey: "holderType" },
      ],
    },
    {
      title: "Disbursement Details",
      headerKey: "disbursementDetails",
      headerInfo: [
        { header: "Type", headKey: "disbursementType" },
        { header: "Account Number", headKey: "accountNo" },
        { header: "Name", headKey: "name" },
        { header: "Emi Payment Start Date", headKey: "emiStartDate" },
      ],
    },
    {
      title: "Bank Account",
      headerKey: "bankAccount",
      headerInfo: [
        { header: "Your Account", headKey: "yourAccount" },
        { header: "Name", headKey: "name" },
        { header: "Your Pan Card", headKey: "yourPan" },
      ],
    },
  ];

  static readonly DYNAMIC_SCREEN = [
    {
      id: 1,
      key: "mobile",
      type: "Create Loan",
      component: CommonMobileVerificationComponent,
    },
    {
      id: 2,
      key: "personal",
      type: "Create Loan",
      component: CommonPersonalDetailsComponent,
    },
    {
      id: 3,
      key: "create",
      type: "Create Loan",
      component: CreateLoanComponent,
    },
    {
      id: 4,
      key: "credit",
      type: "Create Loan",
      component: CibilScoreContainerComponent,
    },
    // {
    //   id: 2,
    //   key: "document",
    //   type: "Create Loan",
    //   component: LoanDocumentUploadComponent,
    // },
    {
      id: 5,
      key: "document",
      type: "Create Loan",
      component: LoanDocumentUploadComponent,
    },
    // {
    //   id: 6,
    //   key: "kyc",
    //   type: "Create Loan",
    //   component: OtherDocumentsComponent,
    // },
    {
      id: 6,
      key: "national",
      type: "Create Loan",
      component: NationalIdUploadComponent,
    },
    {
      id: 7,
      key: "term",
      type: "Create Loan",
      component: LoanTermsConditionsComponent,
    },
    {
      id: 8,
      key: "summary",
      type: "Create Loan",
      component: LoanSummaryComponent,
    },
  ];

  static readonly DEPT_MAPPING = {
    department: "SALES DEPARTMENTS",
    action: [{ status: "Review", next: "VERIFYDET" }],
    code: "DATAINUPUT",
  };
}

export enum CreateLoanEnum {
  INTERNAL = "internal",
  EXTERNAL = "external",
  ACCOUNT_INCLUDES_KEY = "account",
}
