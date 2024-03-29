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
import { UploadBulkUploadComponent } from "./new-reusable-components/upload-bulk-upload/upload-bulk-upload.component";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { SharedModule } from "app/shared/shared.module";
import { MatMenuModule } from "@angular/material/menu";
import { MatToolbarModule } from "@angular/material/toolbar";
import { PendingForApprovalComponent } from "./pending-for-approval/pending-for-approval.component";
import { ApplicantsInfoComponent } from "./new-reusable-components/applicants-info/applicants-info.component";
import { BeneficiarySummaryComponent } from "./trade-flow/beneficiary-summary/beneficiary-summary.component";
import { AddEditBenificiaryComponent } from "./trade-flow/beneficiary-summary/add-edit-benificiary/add-edit-benificiary.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { TradeDashboardComponent } from "./trade-flow/trade-dashboard/trade-dashboard.component";
import { ReusableFooterComponent } from "./new-reusable-components/reusable-footer/reusable-footer.component";
import { AmendementInfoComponent } from "./new-reusable-components/amendement-info/amendement-info.component";
import { BeneficiaryBulkUploadComponent } from "./trade-flow/beneficiary-summary/beneficiary-bulk-upload/beneficiary-bulk-upload.component";
import { OthersInfoComponent } from "./new-reusable-components/others-info/others-info.component";
import { BgInfoComponent } from "./new-reusable-components/bg-info/bg-info.component";
import { BenificiaryDetailsComponent } from "./new-reusable-components/bg-info/benificiary-details/benificiary-details.component";
import { TransactionInfoComponent } from "./new-reusable-components/bg-info/transaction-info/transaction-info.component";
import { BgAmendBgInfoComponent } from "./new-reusable-components/bg-info/bg-amend-bg-info/bg-amend-bg-info.component";
import { BgIssuanceBgInfoComponent } from "./new-reusable-components/bg-info/bg-issuance-bg-info/bg-issuance-bg-info.component";
import { GenericBgComponentComponent } from './new-reusable-components/generic-bg-component/generic-bg-component.component';
import { BgSummaryComponent } from './trade-flow/bg-summary/bg-summary.component';
import { AttachmentsComponent } from './new-reusable-components/attachments/attachments.component';
import { LayoutsModule } from "app/layouts/layouts.module";
import { CustomDrawerComponent } from "./new-reusable-components/custom-drawer/custom-drawer.component";
import { BenificiaryBulkUploadSummaryComponent } from "./trade-flow/beneficiary-summary/benificiary-bulk-upload-summary/benificiary-bulk-upload-summary.component";
import { GoodsInfoComponent } from './new-reusable-components/goods-info/goods-info.component';
import { LcAdditionalInfoComponent } from './new-reusable-components/lc-additional-info/lc-additional-info.component';
import { FeeAccountComponent } from './new-reusable-components/fee-account/fee-account.component';


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
    TradeDashboardComponent,
    ReusableFooterComponent,
    AmendementInfoComponent,
    BeneficiaryBulkUploadComponent,
    OthersInfoComponent,
    BgInfoComponent,
    BenificiaryDetailsComponent,
    TransactionInfoComponent,
    BgAmendBgInfoComponent,
    BgIssuanceBgInfoComponent,
    GenericBgComponentComponent,
    BgSummaryComponent,
    AttachmentsComponent,
    CustomDrawerComponent,
    TradeDashboardComponent,
    BenificiaryBulkUploadSummaryComponent,
    GoodsInfoComponent,
    LcAdditionalInfoComponent,
    FeeAccountComponent,
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
    LayoutsModule,
  ],
})
export class NetBankingModule {}
