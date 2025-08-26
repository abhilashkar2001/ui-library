import { Type } from '@angular/core';

import { LoanDetailsComponent } from '../modules/loan/components/loan-details/loan-details.component';
import { CollateralDetailsComponent } from '../modules/loan/components/collateral-details/collateral-details.component';
import { BusinessDetailsComponent } from '../modules/loan/components/business-details/business-details.component';
import { DocumentUploadComponent } from '../modules/loan/components/document-upload/document-upload.component';
import { DirectorDetailsComponent } from '../modules/loan/components/director-details/director-details.component';
import { DisbursementDetailsComponent } from '../modules/loan/components/disbursement-details/disbursement-details.component';
import { CreditBureauComponent } from '../modules/loan/components/credit-bureau/credit-bureau.component';
import { TermsConditionComponent } from '../modules/loan/components/terms-condition/terms-condition.component';
import { SummaryComponent } from '../modules/loan/components/summary/summary.component';
import { DigitalSignatureComponent } from '../modules/loan/components/digital-signature/digital-signature.component';
import { AccountDetailsComponent } from 'app/modules/create-account/components/account-details/account-details.component';
import { AccountDocumentUploadComponent } from 'app/modules/create-account/components/document-upload/document-upload.component';
import { AccountSummaryComponent } from 'app/modules/create-account/components/summary/summary.component';
import { AccountDigitalSignatureComponent } from 'app/modules/create-account/components/digital-signature/digital-signature.component';
import { PersonalIdentificationComponent } from 'app/modules/create-account/components/personal-identification/personal-identification.component';
import { AccountPersonalDetailsComponent } from 'app/modules/create-account/components/personal-details/personal-details.component';
import { EmpFinDetailsComponent } from 'app/modules/create-account/components/emp-fin-details/emp-fin-details.component';
import { TermsConditionsComponent } from 'app/modules/origination/modules/shared-origination/terms-conditions/terms-conditions.component';
import { AccountServiceComponent } from 'app/modules/cheque-book/components/account-service/account-service.component';
import { PaymentDetailsComponent } from 'app/modules/cheque-book/components/payment-details/payment-details.component';
import { ChequeBookDetailComponent } from 'app/modules/cheque-book/components/cheque-book-detail/cheque-book-detail.component';
import { AccountDetailComponent } from 'app/modules/cheque-book/components/account-detail/account-detail.component';
import { CardDetailsComponent } from 'app/modules/card/components/card-details/card-details.component';
import { EmploymentFinancialDetailsComponent } from 'app/modules/card/components/employment-financial-details/employment-financial-details.component';
import { CardSummaryComponent } from 'app/modules/card/components/summary/card-summary.component';
import { CommonPersonalDetailsComponent } from 'app/shared/components/common-personal-details/common-personal-details.component';

export interface ComponentMap {
  W1LACC: LoanDetailsComponent;
  W1DOCU: DocumentUploadComponent;
  W1BUDE: BusinessDetailsComponent;
  W1DDUD: DocumentUploadComponent;
  W1PERD: DirectorDetailsComponent;
  W1DISD: DisbursementDetailsComponent;
  W1CRBU: CreditBureauComponent;
  W1CODE: CollateralDetailsComponent;
  W1TECO: TermsConditionComponent;
  W1SUM: SummaryComponent;
  W1SIGN: DigitalSignatureComponent;
  W1EMFD: EmpFinDetailsComponent;
}

export const ComponentConstant: {
  [K in keyof ComponentMap]: Type<ComponentMap[K]>;
} = {
  W1LACC: LoanDetailsComponent,
  W1DOCU: DocumentUploadComponent,
  W1BUDE: BusinessDetailsComponent,
  W1DDUD: DocumentUploadComponent,
  W1PERD: DirectorDetailsComponent,
  W1DISD: DisbursementDetailsComponent,
  W1CRBU: CreditBureauComponent,
  W1CODE: CollateralDetailsComponent,
  W1TECO: TermsConditionComponent,
  W1SUM: SummaryComponent,
  W1SIGN: DigitalSignatureComponent,
  W1EMFD: EmpFinDetailsComponent,
};
export interface ComponentAccountMap {
  W1PEID: PersonalIdentificationComponent;
  W1PERD: CommonPersonalDetailsComponent;
  W1ACDE: AccountDetailsComponent;
  W1DOCU: DocumentUploadComponent;
  W1SUM: AccountSummaryComponent;
  W1SIGN: DigitalSignatureComponent;
}

export const ComponentAccountConstant: {
  [K in keyof ComponentAccountMap]: Type<ComponentAccountMap[K]>;
} = {
  W1PEID: PersonalIdentificationComponent,
  W1PERD: CommonPersonalDetailsComponent,
  W1ACDE: AccountDetailsComponent,
  W1DOCU: DocumentUploadComponent,
  W1SUM: AccountSummaryComponent,
  W1SIGN: DigitalSignatureComponent,
};

export interface ComponentStagesMap {
  'Account Details': AccountDetailsComponent;
  'Loan Document': AccountDocumentUploadComponent;
  'Personal Identification': PersonalIdentificationComponent;
  'Personal Details': AccountPersonalDetailsComponent;
  Summary: AccountSummaryComponent;
  Signature: AccountDigitalSignatureComponent;
  'Bussiness Details': BusinessDetailsComponent;
  'Director Document Upload': DocumentUploadComponent;
  'Director Details': DirectorDetailsComponent;
  'Employement Financial Details': EmpFinDetailsComponent;
  'Terms And Conditions': TermsConditionsComponent;
  'Account Services': AccountServiceComponent;
  'Payment Details': PaymentDetailsComponent;
  'Cheque Details': ChequeBookDetailComponent;
  'Account Detail': AccountDetailComponent;
}

export const ComponentStagesConstant: {
  [K in keyof ComponentStagesMap]: Type<ComponentStagesMap[K]>;
} = {
  'Account Details': AccountDetailsComponent,
  'Loan Document': AccountDocumentUploadComponent,
  'Personal Identification': PersonalIdentificationComponent,
  'Personal Details': AccountPersonalDetailsComponent,
  Summary: AccountSummaryComponent,
  Signature: AccountDigitalSignatureComponent,
  'Bussiness Details': BusinessDetailsComponent,
  'Director Document Upload': DocumentUploadComponent,
  'Director Details': DirectorDetailsComponent,
  'Employement Financial Details': EmpFinDetailsComponent,
  'Terms And Conditions': TermsConditionsComponent,
  'Account Services': AccountServiceComponent,
  'Payment Details': PaymentDetailsComponent,
  'Cheque Details': ChequeBookDetailComponent,
  'Account Detail': AccountDetailComponent,
};

// Card Component constant
export interface ComponentCardMap {
  W1PEID: PersonalIdentificationComponent;
  W1PERD: CommonPersonalDetailsComponent;
  W1ACDE: AccountDetailComponent;
  W1CADE: CardDetailsComponent;
  W1DOCU: DocumentUploadComponent;
  W1EMFD: EmploymentFinancialDetailsComponent;
  W1TECO: TermsConditionComponent;
  W1SUM: CardSummaryComponent;
  W1SIGN: DigitalSignatureComponent;
  W1CRBU: CreditBureauComponent;
  W1PYDE: PaymentDetailsComponent;
}

export const ComponentCardConstant: {
  [K in keyof ComponentCardMap]: Type<ComponentCardMap[K]>;
} = {
  W1PEID: PersonalIdentificationComponent,
  W1PERD: CommonPersonalDetailsComponent,
  W1ACDE: AccountDetailComponent,
  W1CADE: CardDetailsComponent,
  W1DOCU: DocumentUploadComponent,
  W1EMFD: EmploymentFinancialDetailsComponent,
  W1TECO: TermsConditionComponent,
  W1SUM: CardSummaryComponent,
  W1SIGN: DigitalSignatureComponent,
  W1CRBU: CreditBureauComponent,
  W1PYDE: PaymentDetailsComponent,
};
