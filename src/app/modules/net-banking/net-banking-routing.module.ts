import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NetBankingHomeComponent } from "./net-banking-home.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { AddBulkUploadComponent } from "./bulk-upload/add-bulk-upload/add-bulk-upload.component";
import { UploadBulkUploadComponent } from "./bulk-upload/upload-bulk-upload/upload-bulk-upload.component";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { PendingForApprovalComponent } from "./pending-for-approval/pending-for-approval.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { BeneficiarySummaryComponent } from "./trade-flow/beneficiary-summary/beneficiary-summary.component";
import { TradeDashboardComponent } from "./trade-flow/trade-dashboard/trade-dashboard.component";
import { AddEditBenificiaryComponent } from "./trade-flow/beneficiary-summary/add-edit-benificiary/add-edit-benificiary.component";
import { BeneficiaryBulkUploadComponent } from "./trade-flow/beneficiary-summary/beneficiary-bulk-upload/beneficiary-bulk-upload.component";

const routes: Routes = [
  {
    path: "",
    component: NetBankingHomeComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "home",
        component: NetBankingDashboardComponent,
      },
      {
        path: "bulk-upload",
        component: BulkUploadComponent,
      },
      {
        path: "pending-for-approval",
        component: PendingForApprovalComponent,
      },
      {
        path: "bulk-upload/:id",
        component: AddBulkUploadComponent,
      },
      // {
      //   path: "add-bulk-upload",
      //   component: UploadBulkUploadComponent,
      // },
    ],
  },
  {
    path: "trade",
    component: TradeFlowComponent,
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full",
      },
      {
        path: "dashboard",
        component: TradeDashboardComponent,
      },

      {
        path: "beneficiary",
        component: BeneficiarySummaryComponent,
      },
      {
        path: "add-edit-beneficiary",
        component: AddEditBenificiaryComponent,
      },
      {
        path: "beneficiary-bulkUpload",
        component: BeneficiaryBulkUploadComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetBankingRoutingModule {}
