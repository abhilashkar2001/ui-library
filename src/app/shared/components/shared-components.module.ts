import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedMaterialModule } from '../shared-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { HeaderTopComponent } from './header-top/header-top.component';
import { AppComfirmComponent } from '../services/app-confirm/app-confirm.component';
import { AppLoaderComponent } from '../services/app-loader/app-loader.component';
import { FooterComponent } from './footer/footer.component';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { FusionChartsModule } from 'angular-fusioncharts';
import FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { SwiperModule } from 'swiper/angular';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { ReusablePincodePopupComponent } from './reusable-pincode-popup/reusable-pincode-popup.component';
import { CustomDateAdapter } from '../services/date-time/customDateAdapter';
import { DateAdapter } from '@angular/material/core';
import { InputMaskModule } from '../directives/input-mask/input-mask.module';
import { WarningComponent } from './warning/warning.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { ViewExcelDocComponent } from './view-excel-doc/view-excel-doc.component';
import { ScanComponent } from './scan/scan.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { StagingSuccessAreaComponent } from './staging-success-area/staging-success-area.component';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { HelpCenterComponent } from './help-center/help-center.component';

FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const components = [
  HeaderTopComponent,
  AppComfirmComponent,
  AppLoaderComponent,
  FooterComponent,
  SearchableSelectComponent,
  ReusablePincodePopupComponent,
  WarningComponent,
  PdfViewerComponent,
  ViewExcelDocComponent,
  ScanComponent,
  StagingSuccessAreaComponent,
  SuccessPopupComponent,
  HelpCenterComponent,
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
    SharedPipesModule,
    SharedDirectivesModule,
    SharedMaterialModule,
    NgOtpInputModule,
    SwiperModule,
    NgxSpinnerModule,
    InputMaskModule,
    IcustLibraryModule,
  ],
  declarations: components,
  exports: components,
  providers: [
    CustomDateAdapter,
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedComponentsModule {}
