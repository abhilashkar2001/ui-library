import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CibilScoreContainerComponent } from './cibil-score-container/cibil-score-container.component';
import { CommonPersonalDetailsComponent } from './common-personal-details/common-personal-details.component';
import { CommonMobileVerificationComponent } from './comon-mobile-verification/common-mobile-verification.component';
import { CompanyInformationComponent } from './company-information/company-information.component';
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
import { NgOtpInputModule } from 'ng-otp-input';
import { SwiperModule } from 'swiper/angular';
import { InputMaskModule } from '../../../../shared/directives/input-mask/input-mask.module';
import { SharedOriginationModule } from '../shared-origination/shared-origination.module';
import { LibPipesModule } from '@onerumango/utils';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { BusinessDetailsComponent } from './business-details/business-details.component';
import { CollateralDetailsComponent } from './collateral-details/collateral-details.component';

const components = [
  CibilScoreContainerComponent,
  CommonPersonalDetailsComponent,
  CommonMobileVerificationComponent,
  CompanyInformationComponent,
  DigitalSignComponent,
  LoanSummaryComponent,
  LoanTermsConditionsComponent,
  NationalIdUploadComponent,
  OtherChecklistDocUploadComponent,
  LoanDetailsComponent,
  BusinessDetailsComponent,
  CollateralDetailsComponent,
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
    SharedModule,
    SharedMaterialModule,
    NgOtpInputModule,
    SwiperModule,
    InputMaskModule,
    IcustLibraryModule,
    SharedOriginationModule,
    LibPipesModule,
  ],
  exports: components,
})
export class DynamicPagesModule {}
