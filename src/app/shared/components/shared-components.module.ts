import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from "../shared-material.module";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "app/shared/components/perfect-scrollbar";
import { SharedPipesModule } from "../pipes/shared-pipes.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { SharedDirectivesModule } from "../directives/shared-directives.module";

import { HeaderTopComponent } from "./header-top/header-top.component";

// ALWAYS REQUIRED
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { AppComfirmComponent } from "../services/app-confirm/app-confirm.component";
import { AppLoaderComponent } from "../services/app-loader/app-loader.component";
import { ButtonLoadingComponent } from "./button-loading/button-loading.component";

import { FooterComponent } from "./footer/footer.component";
import { SavingsSubmitDialogComponent } from "./savings-submit-dialog/savings-submit-dialog.component";
import { ClientReviewComponent } from "./client-review/client-review.component";
import { TopPerformingComponent } from "./top-performing/top-performing.component";

// Import FusionCharts library and chart modules
import * as Widgets from "fusioncharts/fusioncharts.widgets";
import * as FusionTheme from "fusioncharts/themes/fusioncharts.theme.fusion";
// Pass the fusioncharts library and chart modules
import { FusionChartsModule } from "angular-fusioncharts";
// Import FusionCharts library and chart modules
import * as FusionCharts from "fusioncharts";
import * as Charts from "fusioncharts/fusioncharts.charts";
import { TermsConditionsComponent } from "./terms-conditions/terms-conditions.component";
import { CommonMobileVerificationComponent } from "./comon-mobile-verification/common-mobile-verification.component";
import { PersonalDetailsComponent } from "./personal-details/personal-details.component";
import { CarouselComponent } from "./carousel/carousel.component";
import { FaqComponent } from "./faq/faq.component";
import { ClientsComponent } from "./clients/clients.component";
import { AccountHeaderComponent } from "./account-header/account-header.component";
import { CibilScorePoorDialgComponent } from "./cibil-score-poor-dialg/cibil-score-poor-dialg.component";
import { CibilScoreResultComponent } from "./cibil-score-result/cibil-score-result.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NewsLetterSliderComponent } from "./news-letter-slider/news-letter-slider.component";
import { NewsLetterComponent } from "./news-letter/news-letter.component";
import { LandingProfileComponent } from "./landing-profile/landing-profile.component";

import { NgOtpInputModule } from "ng-otp-input";
import { OtherDocumentsComponent } from "./other-documents/other-documents.component";
import { SelectKycComponent } from "./select-kyc/select-kyc.component";
import { CustomSwiperComponent } from "./custom-swiper/custom-swiper.component";
import { SwiperModule } from "swiper/angular";
import { MatIconModule } from "@angular/material/icon";
import { SuccessPopupComponent } from "./success-popup/success-popup.component";

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const components = [
  HeaderTopComponent,
  BreadcrumbComponent,
  AppComfirmComponent,
  AppLoaderComponent,
  ButtonLoadingComponent,
  FooterComponent,
  SavingsSubmitDialogComponent,
  NewsLetterSliderComponent,
  NewsLetterComponent,
  TopPerformingComponent,
  ClientReviewComponent,
  TermsConditionsComponent,
  CommonMobileVerificationComponent,
  PersonalDetailsComponent,
  CarouselComponent,
  FaqComponent,
  CibilScoreResultComponent,
  CibilScorePoorDialgComponent,
  AccountHeaderComponent,
  ClientsComponent,
  LandingProfileComponent,
  OtherDocumentsComponent,
  SelectKycComponent,
  SuccessPopupComponent,
  CustomSwiperComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    FlexLayoutModule,
    FusionChartsModule,
    NgbModule,
    PerfectScrollbarModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SharedMaterialModule,
    NgOtpInputModule,
    SwiperModule,
    MatIconModule,
  ],
  declarations: components,
  exports: components,
})
export class SharedComponentsModule {}
