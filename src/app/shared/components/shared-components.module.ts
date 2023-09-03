import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedMaterialModule } from "../shared-material.module";
import { TranslateModule } from "@ngx-translate/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
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
import { NewsLettersComponent } from "./news-letters/news-letters.component";
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
  NewsLettersComponent,
  TopPerformingComponent,
  ClientReviewComponent,
  TermsConditionsComponent,
  CommonMobileVerificationComponent,
  PersonalDetailsComponent,
  CarouselComponent,
  FaqComponent,
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule,
    FlexLayoutModule,
    FusionChartsModule,
    PerfectScrollbarModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SharedMaterialModule,
  ],
  declarations: components,
  exports: components,
})
export class SharedComponentsModule {}
