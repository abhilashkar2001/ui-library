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
import { FooterComponent } from './footer/footer.component';
import { NgOtpInputModule } from 'ng-otp-input';
import { SwiperModule } from 'swiper/angular';
import { SearchableSelectComponent } from './searchable-select/searchable-select.component';
import { ReusablePincodePopupComponent } from './reusable-pincode-popup/reusable-pincode-popup.component';
import { CustomDateAdapter } from '../services/date-time/customDateAdapter';
import { DateAdapter } from '@angular/material/core';
import { InputMaskModule } from '../directives/input-mask/input-mask.module';
import { WarningComponent } from './warning/warning.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { ViewExcelDocComponent } from './view-excel-doc/view-excel-doc.component';
import { ScanComponent } from './scan/scan.component';
import { IcustLibraryModule } from '@onerumango/icust-element-library';
import { StagingSuccessAreaComponent } from './staging-success-area/staging-success-area.component';
import { SuccessPopupComponent } from './success-popup/success-popup.component';
import { HelpCenterComponent } from './help-center/help-center.component';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';
import { SuccessModalPopupComponent } from './success-modal-popup/success-modal-popup.component';
import { ViewDocSidePanelComponent } from './view-doc-side-panel/view-doc-side-panel.component';
import { BankCodePanelComponent } from './bank-code-panel/bank-code-panel.component';
import { CustomTableComponent } from './custom-table/custom-table.component';
import { TermsConditionPopupComponent } from './terms-condition-popup/terms-condition-popup.component';
import { WebcamModule } from 'ngx-webcam';
import { FingerprintScanComponent } from './fingerprint-scan/fingerprint-scan.component';
import { FaceScanComponent } from './face-scan/face-scan.component';
import { OtpVerificationComponent } from './otp-verification/otp-verification.component';
import { SelectAccountComponent } from './select-account/select-account.component';
import { CustomerTypeSelectorDialogComponent } from './customer-type-selector-dialog/customer-type-selector-dialog/customer-type-selector-dialog.component';
import { PepComponentComponent } from './pep-component/pep-component.component';
import { CommonPersonalDetailsComponent } from './common-personal-details/common-personal-details.component';

const components = [
  HeaderTopComponent,
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
  CustomPopupComponent,
  SuccessModalPopupComponent,
  ViewDocSidePanelComponent,
  BankCodePanelComponent,
  CustomTableComponent,
  TermsConditionPopupComponent,
  FingerprintScanComponent,
  FaceScanComponent,
  OtpVerificationComponent,
  SelectAccountComponent,
  CustomerTypeSelectorDialogComponent,
  PepComponentComponent,
  CommonPersonalDetailsComponent,
];

@NgModule({
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
    NgOtpInputModule,
    SwiperModule,
    InputMaskModule,
    IcustLibraryModule,
    WebcamModule,
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
