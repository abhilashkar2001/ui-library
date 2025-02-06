import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CibilScoreContainerComponent } from './cibil-score-container/cibil-score-container.component';
import { CommonPersonalDetailsComponent } from './common-personal-details/common-personal-details.component';
import { CommonMobileVerificationComponent } from './comon-mobile-verification/common-mobile-verification.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
import { CreateLoanComponent } from './create-loan/create-loan.component';
import { DigitalSignComponent } from './digital-sign/digital-sign.component';
import { LoanSummaryComponent } from './loan-summary/loan-summary.component';
import { LoanTermsConditionsComponent } from './loan-terms-conditions/loan-terms-conditions.component';
import { NationalIdUploadComponent } from './national-id-upload/national-id-upload.component';
import { OtherChecklistDocUploadComponent } from './other-checklist-doc-upload/other-checklist-doc-upload.component';

const components = [
  CibilScoreContainerComponent,
  CommonPersonalDetailsComponent,
  CommonMobileVerificationComponent,
  CompanyInformationComponent,
  CreateLoanComponent,
  DigitalSignComponent,
  LoanSummaryComponent,
  LoanTermsConditionsComponent,
  NationalIdUploadComponent,
  OtherChecklistDocUploadComponent,
];

@NgModule({
  declarations: components,
  imports: [CommonModule],
  exports: components,
})
export class DynamicPagesModule {}
