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
export interface AccountComponentMap {
  'Account Details': AccountDetailsComponent;
  'Document Upload': AccountDocumentUploadComponent;
  'Personal Identification': PersonalIdentificationComponent;
  'Personal Details': AccountPersonalDetailsComponent;
  Summary: AccountSummaryComponent;
  'Digital Signature': AccountDigitalSignatureComponent;
  'Bussiness Details': BusinessDetailsComponent;
  'Director Document Upload': DocumentUploadComponent;
  'Director Details': DirectorDetailsComponent;
}

export const AccountComponentConstant: {
  [K in keyof AccountComponentMap]: Type<AccountComponentMap[K]>;
} = {
  'Account Details': AccountDetailsComponent,
  'Document Upload': AccountDocumentUploadComponent,
  'Personal Identification': PersonalIdentificationComponent,
  'Personal Details': AccountPersonalDetailsComponent,
  Summary: AccountSummaryComponent,
  'Digital Signature': AccountDigitalSignatureComponent,
  'Bussiness Details': BusinessDetailsComponent,
  'Director Document Upload': DocumentUploadComponent,
  'Director Details': DirectorDetailsComponent,
};
