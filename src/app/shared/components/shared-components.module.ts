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
import { SavingsSubmitDialogComponent } from '../../modules/origination/modules/shared-origination/savings-submit-dialog/savings-submit-dialog.component';
import { TopPerformingComponent } from '../../modules/origination/modules/shared-origination/top-performing/top-performing.component';
import * as Widgets from 'fusioncharts/fusioncharts.widgets';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import { FusionChartsModule } from 'angular-fusioncharts';
import * as FusionCharts from 'fusioncharts';
import * as Charts from 'fusioncharts/fusioncharts.charts';
import { TermsConditionsComponent } from '../../modules/origination/modules/shared-origination/terms-conditions/terms-conditions.component';
import { CommonMobileVerificationComponent } from '../../modules/origination/modules/dynamic-pages/comon-mobile-verification/common-mobile-verification.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { SelectKycComponent } from '../../modules/origination/modules/shared-origination/select-kyc/select-kyc.component';
import { SwiperModule } from 'swiper/angular';
import { MatIconModule } from '@angular/material/icon';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { CommonPersonalDetailsComponent } from '../../modules/origination/modules/dynamic-pages/common-personal-details/common-personal-details.component';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { ReusablePincodePopupComponent } from './reusable-pincode-popup/reusable-pincode-popup.component';
import { ShowDocumentComponent } from '../../modules/origination/modules/shared-origination/show-document/show-document.component';
import { UserHeaderTopComponent } from './user-header-top/user-header-top.component';
import { SubNavBarComponent } from './sub-nav-bar/sub-nav-bar.component';
import { CustomDateAdapter } from '../services/date-time/customDateAdapter';
import { DateAdapter } from '@angular/material/core';
import { InputMaskModule } from '../directives/input-mask/input-mask.module';

import { WebDocUploadComponent } from '../../modules/origination/modules/shared-origination/web-doc-upload/web-doc-upload.component';
import { WarningComponent } from './warning/warning.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SelectSingleTransferComponent } from '../../modules/net-banking/modules/shared-corporate-banking/select-single-transfer/select-single-transfer.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { OtherChecklistDocUploadComponent } from '../../modules/origination/modules/dynamic-pages/other-checklist-doc-upload/other-checklist-doc-upload.component';
import { StagingSuccessAreaComponent } from '../../modules/origination/modules/shared-origination/staging-success-area/staging-success-area.component';
import { CompanyInformationComponent } from '../../modules/origination/modules/dynamic-pages/company-information/company-information.component';
import { ViewExcelDocComponent } from './view-excel-doc/view-excel-doc.component';
import { DigitalSignComponent } from '../../modules/origination/modules/dynamic-pages/digital-sign/digital-sign.component';
import { ScanComponent } from './scan/scan.component';
import { TabLinkComponent } from '../../modules/net-banking/modules/shared-corporate-banking/widgets/tab-link/tab-link.component';
import { TransactionCardComponent } from '../../modules/net-banking/modules/shared-corporate-banking/widgets/transaction-card/transaction-card.component';
import { SwiperCardComponent } from '../../modules/net-banking/modules/shared-corporate-banking/swiper-card/swiper-card.component';
import { ToolbarTitleComponent } from '../../modules/net-banking/modules/shared-corporate-banking/widgets/toolbar-title/toolbar-title.component';
import { ToolbarTabComponent } from '../../modules/net-banking/modules/shared-corporate-banking/widgets/toolbar-tab/toolbar-tab.component';
import { LinkPayeeSideBarComponent } from '../../modules/net-banking/modules/shared-corporate-banking/widgets/link-payee-side-bar/link-payee-side-bar.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SidebarSideComponent } from './sidebar-side/sidebar-side.component';
import { MatInputModule } from '@angular/material/input';
// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, Charts, Widgets, FusionTheme);

const components = [
  HeaderTopComponent,
  AppComfirmComponent,
  AppLoaderComponent,
  FooterComponent,
  SavingsSubmitDialogComponent,
  TopPerformingComponent,
  TermsConditionsComponent,
  CommonMobileVerificationComponent,
  SelectKycComponent,
  SuccessPopupComponent,
  CommonPersonalDetailsComponent,
  SearchableSelectComponent,
  ReusablePincodePopupComponent,
  ShowDocumentComponent,
  UserHeaderTopComponent,
  SubNavBarComponent,
  WebDocUploadComponent,
  WarningComponent,
  SelectSingleTransferComponent,
  PdfViewerComponent,
  OtherChecklistDocUploadComponent,
  StagingSuccessAreaComponent,
  CompanyInformationComponent,
  ViewExcelDocComponent,
  DigitalSignComponent,
  ScanComponent,
  TransactionCardComponent,
  TabLinkComponent,
  SwiperCardComponent,
  ToolbarTitleComponent,
  ToolbarTabComponent,
  LinkPayeeSideBarComponent,
  SidebarSideComponent,
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
    MatIconModule,
    NgxSpinnerModule,
    InputMaskModule,
    MatIconModule,
    MatFormFieldModule,
    IcustLibraryModule,
    MatInputModule,
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
