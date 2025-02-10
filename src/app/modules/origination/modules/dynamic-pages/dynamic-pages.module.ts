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
import { SharedModule } from '../../../../shared/shared.module';
import { SharedMaterialModule } from '../../../../shared/shared-material.module';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FusionChartsModule } from 'angular-fusioncharts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { SwiperModule } from 'swiper/angular';
import { NgxSpinnerModule } from 'ngx-spinner';
import { InputMaskModule } from '../../../../shared/directives/input-mask/input-mask.module';
import { SharedOriginationModule } from '../shared-origination/shared-origination.module';

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
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FlexLayoutModule,
    FusionChartsModule,
    NgbModule,
    SharedModule,
    SharedMaterialModule,
    NgOtpInputModule,
    SwiperModule,
    NgxSpinnerModule,
    InputMaskModule,
    IcustLibraryModule,
    SharedOriginationModule,
  ],
  exports: components,
})
export class DynamicPagesModule {}
