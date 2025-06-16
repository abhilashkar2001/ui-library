import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommmonSteeperComponent } from './commmon-steeper/commmon-steeper.component';
import { CarouselComponent } from './carousel/carousel.component';
import { CibilScoreChartComponent } from './cibil-score-chart/cibil-score-chart.component';
import { CibilScorePoorDialgComponent } from './cibil-score-poor-dialg/cibil-score-poor-dialg.component';
import { CibilScoreResultComponent } from './cibil-score-result/cibil-score-result.component';
import { CommonProductComponent } from './common-product/common-product.component';
import { CusotmWebDocUploadComponent } from './cusotm-web-doc-upload/cusotm-web-doc-upload.component';
import { ErrorNotifierPopupComponent } from './error-notifier-popup/error-notifier-popup.component';
import { FaqComponent } from './faq/faq.component';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { LandingProfileComponent } from './landing-profile/landing-profile.component';
import { NewsLetterComponent } from './news-letter/news-letter.component';
import { NewsLetterSliderComponent } from './news-letter-slider/news-letter-slider.component';
import { OtherDocumentsComponent } from './other-documents/other-documents.component';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { ReusableAlertPopupComponent } from './reusable-alert-popup/reusable-alert-popup.component';
import { SavingsSubmitDialogComponent } from './savings-submit-dialog/savings-submit-dialog.component';
import { SelectKycComponent } from './select-kyc/select-kyc.component';
import { ShowDocumentComponent } from './show-document/show-document.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { TopPerformingComponent } from './top-performing/top-performing.component';
import { WebDocUploadComponent } from './web-doc-upload/web-doc-upload.component';
import { SharedMaterialModule } from '../../../../shared/shared-material.module';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgOtpInputModule } from 'ng-otp-input';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { SharedDirectivesModule } from '../../../../shared/directives/shared-directives.module';
import { SwiperModule } from 'swiper/angular';
import { InputMaskModule } from '../../../../shared/directives/input-mask/input-mask.module';
import { SharedComponentsModule } from '../../../../shared/components/shared-components.module';
import { LibPipesModule } from '@onerumango/utils';
import { ViewLoanDocComponent } from './view-loan-doc/view-loan-doc.component';

const components = [
  CarouselComponent,
  CibilScoreChartComponent,
  CibilScorePoorDialgComponent,
  CibilScoreResultComponent,
  CommmonSteeperComponent,
  CommonProductComponent,
  CusotmWebDocUploadComponent,
  ErrorNotifierPopupComponent,
  FaqComponent,
  ImageDialogComponent,
  LandingProfileComponent,
  NewsLetterComponent,
  NewsLetterSliderComponent,
  OtherDocumentsComponent,
  PersonalDetailsComponent,
  ReusableAlertPopupComponent,
  SavingsSubmitDialogComponent,
  SelectKycComponent,
  ShowDocumentComponent,
  TermsConditionsComponent,
  TopPerformingComponent,
  WebDocUploadComponent,
  ViewLoanDocComponent,
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
    SharedPipesModule,
    SharedDirectivesModule,
    SharedMaterialModule,
    SharedComponentsModule,
    NgOtpInputModule,
    SwiperModule,
    InputMaskModule,
    IcustLibraryModule,
    LibPipesModule,
  ],
  exports: components,
})
export class SharedOriginationModule {}
