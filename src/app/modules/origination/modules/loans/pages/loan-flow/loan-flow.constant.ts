import { CommonPersonalDetailsComponent } from 'app/modules/origination/modules/dynamic-pages/common-personal-details/common-personal-details.component';
import { CommonMobileVerificationComponent } from 'app/modules/origination/modules/dynamic-pages/comon-mobile-verification/common-mobile-verification.component';
import { CibilScoreContainerComponent } from '../../../dynamic-pages/cibil-score-container/cibil-score-container.component';
import { LoanTermsConditionsComponent } from '../../../dynamic-pages/loan-terms-conditions/loan-terms-conditions.component';
import { LoanSummaryComponent } from '../../../dynamic-pages/loan-summary/loan-summary.component';
import { NationalIdUploadComponent } from '../../../dynamic-pages/national-id-upload/national-id-upload.component';
import { OtherChecklistDocUploadComponent } from 'app/modules/origination/modules/dynamic-pages/other-checklist-doc-upload/other-checklist-doc-upload.component';
import { CompanyInformationComponent } from 'app/modules/origination/modules/dynamic-pages/company-information/company-information.component';
import { DigitalSignComponent } from 'app/modules/origination/modules/dynamic-pages/digital-sign/digital-sign.component';
// import { LoanDetailsComponent } from '../../../dynamic-pages/loan-details/loan-details.component';
import { CollateralDetailsComponent } from '../../../dynamic-pages/collateral-details/collateral-details.component';
import { BusinessDetailsComponent } from '../../../dynamic-pages/business-details/business-details.component';

export class LoanFlowConstants {
  static readonly CUSTOM_HEADER = [
    {
      title: 'Loan Details',
      headerKey: 'loanDetails',
      headerInfo: [
        { header: 'loan Ammount', headKey: 'loanAmount' },
        { header: 'Tenure', headKey: 'loanTenure' },
        { header: 'EMI Ammount', headKey: 'emiAmount' },
        { header: 'Interest Rate', headKey: 'interestRate' },
        { header: 'Interest Paybale', headKey: 'interestPayable' },
        { header: 'Principle Ammount', headKey: 'principalAmount' },
        { header: 'Total Payable Ammount', headKey: 'totalPayableAmount' },
        { header: 'Holder Type', headKey: 'holderType' },
      ],
    },
    {
      title: 'Disbursement Details',
      headerKey: 'disbursementDetails',
      headerInfo: [
        { header: 'Type', headKey: 'disbursementType' },
        { header: 'Account Number', headKey: 'accountNo' },
        { header: 'Name', headKey: 'name' },
        { header: 'Emi Payment Start Date', headKey: 'emiStartDate' },
      ],
    },
    {
      title: 'Bank Account',
      headerKey: 'bankAccount',
      headerInfo: [
        { header: 'Your Account', headKey: 'yourAccount' },
        { header: 'Name', headKey: 'name' },
        { header: 'Your Pan Card', headKey: 'yourPan' },
      ],
    },
  ];

  static readonly DYNAMIC_SCREEN = [
    {
      id: 1,
      key: 'mobile',
      type: 'Create Loan',
      component: CommonMobileVerificationComponent,
    },
    {
      id: 2,
      key: 'personal',
      type: 'Create Loan',
      component: CommonPersonalDetailsComponent,
    },
    {
      id: 3,
      key: 'create',
      type: 'Create Loan',
      component: CommonPersonalDetailsComponent,
    },
    {
      id: 4,
      key: 'credit',
      type: 'Create Loan',
      component: CibilScoreContainerComponent,
    },
    {
      id: 2,
      key: 'company',
      type: 'Company Information',
      component: CompanyInformationComponent,
    },
    {
      id: 5,
      key: 'document',
      type: 'Create Loan',
      component: OtherChecklistDocUploadComponent,
    },
    {
      id: 6,
      key: 'director',
      type: 'Create Loan',
      component: CommonPersonalDetailsComponent,
    },
    {
      id: 6,
      key: 'national',
      type: 'Create Loan',
      component: NationalIdUploadComponent,
    },

    {
      id: 6,
      key: 'collateral',
      type: 'Collateral Details',
      component: CollateralDetailsComponent,
    },
    {
      id: 5,
      key: 'business',
      type: 'Business Details',
      component: BusinessDetailsComponent,
    },

    {
      id: 6,
      key: 'signature',
      type: 'Signature',
      component: DigitalSignComponent,
    },
    {
      id: 7,
      key: 'term',
      type: 'Create Loan',
      component: LoanTermsConditionsComponent,
    },
    {
      id: 8,
      key: 'summary',
      type: 'Create Loan',
      component: LoanSummaryComponent,
    },
  ];
}

export enum CreateLoanEnum {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  ACCOUNT_INCLUDES_KEY = 'account',
}
