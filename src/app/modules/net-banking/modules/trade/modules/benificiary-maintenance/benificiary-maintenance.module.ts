import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BenificiaryMaintenanceRoutingModule } from './benificiary-maintenance-routing.module';
import { AddEditBenificiaryComponent } from './add-edit-benificiary/add-edit-benificiary.component';
import { BenificiaryBulkUploadSummaryComponent } from './benificiary-bulk-upload-summary/benificiary-bulk-upload-summary.component';
import { BeneficiarySummaryComponent } from './beneficiary-summary/beneficiary-summary.component';
import { BeneficiaryBulkUploadComponent } from './beneficiary-bulk-upload/beneficiary-bulk-upload.component';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { SharedTradeModule } from '../shared-trade/shared-trade.module';
import { SharedCorporateBankingModule } from '../../../shared-corporate-banking/shared-corporate-banking.module';

@NgModule({
  declarations: [
    AddEditBenificiaryComponent,
    BeneficiaryBulkUploadComponent,
    BenificiaryBulkUploadSummaryComponent,
    BeneficiarySummaryComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SharedMaterialModule,
    SharedComponentsModule,
    BenificiaryMaintenanceRoutingModule,
    SharedTradeModule,
    SharedCorporateBankingModule,
  ],
})
export class BenificiaryMaintenanceModule {}
