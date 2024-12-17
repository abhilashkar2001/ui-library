import { NgModule, Type } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { BgSummaryComponent } from '../shared-trade/bg-summary/bg-summary.component';
import { ApplicantsInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/applicants-info/applicants-info.component';
import { AttachmentsComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/attachments/attachments.component';
import { OthersInfoComponent } from 'app/modules/net-banking/modules/trade/modules/shared-trade/others-info/others-info.component';
import { GenericBgComponentComponent } from '../shared-trade/generic-bg-component/generic-bg-component.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FeeAccountComponent } from './fee-account/fee-account.component';
import { BenificiaryDetailsComponent } from './benificiary-details/benificiary-details.component';
import { UploadBulkUploadComponent } from './upload-bulk-upload/upload-bulk-upload.component';
import { RouterModule } from '@angular/router';

const components: Type<any>[] = [
  BgSummaryComponent,
  GenericBgComponentComponent,
  ApplicantsInfoComponent,
  OthersInfoComponent,
  AttachmentsComponent,
  FeeAccountComponent,
  BenificiaryDetailsComponent,
  UploadBulkUploadComponent,
];
@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FlexLayoutModule,
    SharedComponentsModule,
    SharedMaterialModule,
    RouterModule,
  ],
  exports: components,
})
export class SharedTradeModule {}
