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
};
export interface ComponentStagesMap {
  'Account Details': AccountDetailsComponent;
  'Document Upload': AccountDocumentUploadComponent;
  'Personal Identification': PersonalIdentificationComponent;
  'Personal Details': AccountPersonalDetailsComponent;
  'Summary': AccountSummaryComponent;
  'Digital Signature': AccountDigitalSignatureComponent;
  'Bussiness Details': BusinessDetailsComponent;
  'Director Document Upload': DocumentUploadComponent;
  'Director Details': AccountPersonalDetailsComponent;
  'Employment & Financial Details': EmpFinDetailsComponent;
  'Terms & Conditions': TermsConditionsComponent
  'Account Services': AccountServiceComponent;
  'Payment Details': PaymentDetailsComponent;
  'Cheque Book Details': ChequeBookDetailComponent;
}

export const ComponentStagesConstant: {
  [K in keyof ComponentStagesMap]: Type<ComponentStagesMap[K]>;
} = {
  'Account Details': AccountDetailsComponent,
  'Document Upload': AccountDocumentUploadComponent,
  'Personal Identification': PersonalIdentificationComponent,
  'Personal Details': AccountPersonalDetailsComponent,
  'Summary': AccountSummaryComponent,
  'Digital Signature': AccountDigitalSignatureComponent,
  'Bussiness Details': BusinessDetailsComponent,
  'Director Document Upload': DocumentUploadComponent,
  'Director Details': AccountPersonalDetailsComponent,
  'Employment & Financial Details': EmpFinDetailsComponent,
  'Terms & Conditions': TermsConditionsComponent
  'Account Services': AccountServiceComponent,
  'Payment Details': PaymentDetailsComponent,
  'Cheque Book Details': ChequeBookDetailComponent,
};
