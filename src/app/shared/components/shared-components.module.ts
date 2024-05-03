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
import { BreadcrumbComponent } from "./core-components/breadcrumb/breadcrumb.component";
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
import { CarouselComponent } from "./carousel/carousel.component";
import { FaqComponent } from "./faq/faq.component";
import { ClientsComponent } from "./clients/clients.component";
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
import { CommmonSteeperComponent } from "./commmon-steeper/commmon-steeper.component";
import { CommonPersonalDetailsComponent } from "./common-personal-details/common-personal-details.component";
import { SearchableSelectComponent } from "./searchable-select/searchable-select.component";
import { ReusablePincodePopupComponent } from "./reusable-pincode-popup/reusable-pincode-popup.component";
import { CustomPaginationComponent } from "./custom-pagination/custom-pagination.component";
import { CommonProductComponent } from "./common-product/common-product.component";
import { ImageDialogComponent } from "./image-dialog/image-dialog.component";
import { ShowDocumentComponent } from "./show-document/show-document.component";
import { ErrorNotifierPopupComponent } from "./error-notifier-popup/error-notifier-popup.component";
import { AllInOnePopupComponent } from "./all-in-one-popup/all-in-one-popup.component";
import { CalendarHeaderComponent } from "./calendar-header/calendar-header.component";
import { CreatedDurationModelComponent } from "./created-duration-model/created-duration-model.component";
import { NewReusableFilterComponent } from "./new-reusable-filter/new-reusable-filter.component";
import { NewReusableMatTableComponent } from "./new-reusable-mat-table/new-reusable-mat-table.component";
import { CommonLevelStatusComponent } from "./common-level-status/common-level-status.component";
import { AduitLogDetailsComponent } from "./audit-log/aduit-log-details/aduit-log-details.component";
import { AuditLogTableComponent } from "./audit-log/audit-log-table/audit-log-table.component";
import { AuditLogPopupComponent } from "./audit-log/audit-log-popup/audit-log-popup.component";
import { NewAuditlogButtonGroupComponent } from "./new-auditlog-button-group/new-auditlog-button-group.component";
import { UserHeaderTopComponent } from "./user-header-top/user-header-top.component";
import { AddNewPopupComponent } from "./add-new-popup/add-new-popup.component";
import { SubNavBarComponent } from "./sub-nav-bar/sub-nav-bar.component";
import { InputDatePickerComponent } from "./input-date-picker/input-date-picker.component";
import { CustomDateAdapter } from "../services/date-time/customDateAdapter";
import { DateAdapter } from "@angular/material/core";
import { InputMaskModule } from "../directives/input-mask/input-mask.module";

import { WebDocUploadComponent } from "./web-doc-upload/web-doc-upload.component";
import { WarningComponent } from "./warning/warning.component";
import { SpinnerComponent } from "./core-components/spinner/spinner.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { IcCustomInputComponent } from "./ic-custom-input/ic-custom-input.component";
import { IcRowInputComponent } from "./ic-row-input/ic-row-input.component";
import { ReusableTableComponent } from "./reusable-table/reusable-table.component";
import { SelectSingleTransferComponent } from "./select-single-transfer/select-single-transfer.component";
import { CustomSuccessPopupComponent } from "./custom-success-popup/custom-success-popup.component";

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
  CarouselComponent,
  FaqComponent,
  CibilScoreResultComponent,
  CibilScorePoorDialgComponent,
  ClientsComponent,
  LandingProfileComponent,
  OtherDocumentsComponent,
  SelectKycComponent,
  SuccessPopupComponent,
  CustomSwiperComponent,
  CommmonSteeperComponent,
  CommonPersonalDetailsComponent,
  SearchableSelectComponent,
  ReusablePincodePopupComponent,
  CustomPaginationComponent,
  CommonProductComponent,
  ImageDialogComponent,
  ShowDocumentComponent,
  ErrorNotifierPopupComponent,
  NewReusableMatTableComponent,
  NewReusableFilterComponent,
  CreatedDurationModelComponent,
  CalendarHeaderComponent,
  AllInOnePopupComponent,
  CommonLevelStatusComponent,
  AuditLogTableComponent,
  AduitLogDetailsComponent,
  AuditLogPopupComponent,
  NewAuditlogButtonGroupComponent,
  UserHeaderTopComponent,
  AddNewPopupComponent,
  SubNavBarComponent,
  InputDatePickerComponent,
  ReusableTableComponent,
  WebDocUploadComponent,
  WarningComponent,
  SpinnerComponent,
  IcCustomInputComponent,
  IcRowInputComponent,
  SelectSingleTransferComponent,
  CustomSuccessPopupComponent,
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
    NgxSpinnerModule,
    InputMaskModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    CustomDateAdapter,
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
})
export class SharedComponentsModule {}
