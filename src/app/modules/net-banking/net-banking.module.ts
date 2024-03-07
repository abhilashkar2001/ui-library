import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NetBankingHomeComponent } from "./net-banking-home.component";
import { NetBankingRoutingModule } from "./net-banking-routing.module";
import { SharedComponentsModule } from "app/shared/components/shared-components.module";
import { SharedMaterialModule } from "app/shared/shared-material.module";
import { FlexLayoutModule } from "@angular/flex-layout";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { AddBulkUploadComponent } from "./bulk-upload/add-bulk-upload/add-bulk-upload.component";
import { UploadBulkUploadComponent } from "./bulk-upload/upload-bulk-upload/upload-bulk-upload.component";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { PendingForApprovalComponent } from "./pending-for-approval/pending-for-approval.component";
import { ApplicantsInfoComponent } from "./new-reusable-components/applicants-info/applicants-info.component";
import { BeneficiarySummaryComponent } from "./trade-flow/beneficiary-summary/beneficiary-summary.component";
import { AddEditBenificiaryComponent } from "./trade-flow/beneficiary-summary/add-edit-benificiary/add-edit-benificiary.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { BeneficiaryBulkUploadComponent } from './trade-flow/beneficiary-summary/beneficiary-bulk-upload/beneficiary-bulk-upload.component';
@NgModule({
  declarations: [
    NetBankingHomeComponent,
    BulkUploadComponent,
    AddBulkUploadComponent,
    UploadBulkUploadComponent,
    NetBankingDashboardComponent,
    PendingForApprovalComponent,
    ApplicantsInfoComponent,
    BeneficiarySummaryComponent,
    AddEditBenificiaryComponent,
    TradeFlowComponent,
    BeneficiaryBulkUploadComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NetBankingRoutingModule,
    SharedComponentsModule,
    SharedMaterialModule,
    FlexLayoutModule,
    SharedModule,
    MatMenuModule,
    MatToolbarModule,
  ],
})
export class NetBankingModule {}
