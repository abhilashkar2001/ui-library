import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NetBankingHomeComponent } from "./net-banking-home.component";
import { BulkUploadComponent } from "./bulk-upload/bulk-upload.component";
import { AddBulkUploadComponent } from "./bulk-upload/add-bulk-upload/add-bulk-upload.component";
import { UploadBulkUploadComponent } from "./new-reusable-components/upload-bulk-upload/upload-bulk-upload.component";
import { NetBankingDashboardComponent } from "./net-banking-dashboard/net-banking-dashboard/net-banking-dashboard.component";
import { PendingForApprovalComponent } from "./pending-for-approval/pending-for-approval.component";
import { TradeFlowComponent } from "./trade-flow/trade-flow.component";
import { BeneficiarySummaryComponent } from "./trade-flow/beneficiary-summary/beneficiary-summary.component";
import { TradeDashboardComponent } from "./trade-flow/trade-dashboard/trade-dashboard.component";
import { ApplicantsInfoComponent } from "./new-reusable-components/applicants-info/applicants-info.component";

import { AddEditBenificiaryComponent } from "./trade-flow/beneficiary-summary/add-edit-benificiary/add-edit-benificiary.component";
import { BeneficiaryBulkUploadComponent } from "./trade-flow/beneficiary-summary/beneficiary-bulk-upload/beneficiary-bulk-upload.component";
import { AmendementInfoComponent } from "./new-reusable-components/amendement-info/amendement-info.component";
import { GenericBgComponentComponent } from "./new-reusable-components/generic-bg-component/generic-bg-component.component";
import { BgInfoComponent } from "./new-reusable-components/bg-info/bg-info.component";
import { BenificiaryBulkUploadSummaryComponent } from "./trade-flow/beneficiary-summary/benificiary-bulk-upload-summary/benificiary-bulk-upload-summary.component";
import { BgSummaryComponent } from "./trade-flow/bg-summary/bg-summary.component";
import { RemittanceSummeryComponent } from "./trade-flow/remittance-summery/remittance-summery.component";
import { GenericRemittanceComponent } from "./new-reusable-components/generic-remittance/generic-remittance.component";
import { PreShipmentLPSummaryComponent } from "./trade-flow/pre-shipment-lp-summary/pre-shipment-lp-summary.component";
import { ExportProcessInfoComponent } from "./new-reusable-components/export-process-info/export-process-info.component";

import { EefcComponent } from "./trade-flow/eefc/eefc.component";
import { AddNewEefcComponent } from "./trade-flow/eefc/add-new-eefc/add-new-eefc.component";

import { ExportBillDispatchSummaryComponent } from "./trade-flow/export-bill-dispatch-summary/export-bill-dispatch-summary.component";
import { TransactionDetailsComponent } from "./new-reusable-components/transaction-details/transaction-details.component";

import { ExportSWBillLodgementComponent } from "./trade-flow/export-sw-bill-lodgement/export-sw-bill-lodgement.component";
import { AddExportSwBillComponent } from "./trade-flow/export-sw-bill-lodgement/add-export-sw-bill/add-export-sw-bill.component";
import { BillProcessingSummaryComponent } from "./trade-flow/bill-processing-summary/bill-processing-summary.component";
import { DocumentAcceptanceComponent } from "./new-reusable-components/document-acceptance/document-acceptance.component";
import { BuyersCreditSummaryComponent } from "./trade-flow/buyers-credit-summary/buyers-credit-summary.component";
import { GenericBuyerCreditComponent } from "./new-reusable-components/generic-buyer-credit/generic-buyer-credit.component";

import { ChequeComponent } from "./cheque-book/cheque/cheque.component";

import { DispatchDocumentsComponent } from "./new-reusable-components/dispatch-documents/dispatch-documents.component";
import { GenericExportBillDispatchComponent } from "./new-reusable-components/generic-export-bill-dispatch/generic-export-bill-dispatch.component";

import { PaymentRequestEnquiryComponent } from "./new-reusable-components/payment-request-enquiry/payment-request-enquiry.component";


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
        path: "trade",
        component: TradeFlowComponent,
        children: [
          {
            path: "",
            redirectTo: "bgInfo",
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
            path: "bulk-upload/:id",
            component: BeneficiaryBulkUploadComponent,
          },
          {
            path: "bulk-upload",
            component: BenificiaryBulkUploadSummaryComponent,
          },
          {
            path: "genericBg",
            component: GenericBgComponentComponent,
          },
          {
            path: "generic-remitance",
            component: GenericRemittanceComponent,
          },
          {
            path: "document-acceptance",
            component: DocumentAcceptanceComponent,
          },
          {
            path: "payment-request-enquiry",
            component: PaymentRequestEnquiryComponent,
          },
          {
            path: "remittance-summery",
            component: RemittanceSummeryComponent,
          },
          {
            path: "export-bill-dispatch-summary",
            component: ExportBillDispatchSummaryComponent,
          },
          {
            path: "export-bill-dispatch",
            component: GenericExportBillDispatchComponent,
          },
          {
            path: "generic-buyer-credit",
            component: GenericBuyerCreditComponent,
          },
          {
            path: "buyer-credit-summery",
            component: BuyersCreditSummaryComponent,
          },
          {
            path: "bgSummary",
            component: BgSummaryComponent,
          },
          {
            path: "export-process-summery",
            component: PreShipmentLPSummaryComponent,
          },
          {
            path: "export-process-tabs",
            component: ExportProcessInfoComponent,
          },
          {
            path: "eefc-summary",
            component: EefcComponent,
          },
          {
            path: "add-edit-eefc",
            component: AddNewEefcComponent,
          },
          {
            path: "bill-processing",
            component: BillProcessingSummaryComponent,
          },
          {
            path: "ExportSWBillLodgementSummary",
            component: ExportSWBillLodgementComponent,
          },
          {
            path: "add-export",
            component: AddExportSwBillComponent,
          },
          {
            path: "bill-processing",
            component: BillProcessingSummaryComponent,
          },
        ],
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
      {
        path: "fund-transfer",
        loadChildren: () =>
          import("./fund-transfer/fund-transfer.module").then(
            (m) => m.FundTransferModule
          ),
      },
      {
        path: "cheque",
        loadChildren: () =>
          import("./cheque-book/cheque-book.module").then(
            (m) => m.ChequeBookModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NetBankingRoutingModule {}
