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
