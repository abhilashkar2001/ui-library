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
import { GenericBgComponentComponent } from "./new-reusable-components/generic-bg-component/generic-bg-component.component";
import { BgSummaryComponent } from "./trade-flow/bg-summary/bg-summary.component";
import { AttachmentsComponent } from "./new-reusable-components/attachments/attachments.component";
import { LayoutsModule } from "app/layouts/layouts.module";
import { CustomDrawerComponent } from "./new-reusable-components/custom-drawer/custom-drawer.component";
import { BenificiaryBulkUploadSummaryComponent } from "./trade-flow/beneficiary-summary/benificiary-bulk-upload-summary/benificiary-bulk-upload-summary.component";
import { PreShipmentLPSummaryComponent } from "./trade-flow/pre-shipment-lp-summary/pre-shipment-lp-summary.component";
import { ExportProcessInfoComponent } from "./new-reusable-components/export-process-info/export-process-info.component";
import { ExportApplicationDetailsComponent } from "./new-reusable-components/export-application-details/export-application-details.component";
import { ExportLoanDetailsComponent } from "./new-reusable-components/export-loan-details/export-loan-details.component";
import { ExportAttachmentsComponent } from "./new-reusable-components/export-attachments/export-attachments.component";
import { ExportLcDetailsComponent } from "./new-reusable-components/export-lc-details/export-lc-details.component";
import { LcInfoComponent } from "./new-reusable-components/lc-info/lc-info.component";
import { GoodsInfoComponent } from "./new-reusable-components/goods-info/goods-info.component";
import { LcAdditionalInfoComponent } from "./new-reusable-components/lc-additional-info/lc-additional-info.component";
import { LcOtherConditionsComponent } from "./new-reusable-components/lc-other-conditions/lc-other-conditions.component";
import { FeeAccountComponent } from "./new-reusable-components/fee-account/fee-account.component";
import { AmendmentLcInfoComponent } from "./new-reusable-components/amendment-lc-info/amendment-lc-info.component";
import { LcAmendementInfoComponent } from "./new-reusable-components/lc-amendement-info/lc-amendement-info.component";
import { RemittanceSummeryComponent } from "./trade-flow/remittance-summery/remittance-summery.component";
import { GenericRemittanceComponent } from "./new-reusable-components/generic-remittance/generic-remittance.component";
import { RemittanceInfoComponent } from "./new-reusable-components/remittance-info/remittance-info.component";
import { ExportSWBillLodgementComponent } from "./trade-flow/export-sw-bill-lodgement/export-sw-bill-lodgement.component";
import { AddExportSwBillComponent } from "./trade-flow/export-sw-bill-lodgement/add-export-sw-bill/add-export-sw-bill.component";
import { BillSectionAComponent } from "./new-reusable-components/bill-section-a/bill-section-a.component";
import { BillSectionBComponent } from "./new-reusable-components/bill-section-b/bill-section-b.component";
import { BillSectionCValuesComponent } from "./new-reusable-components/bill-section-c-values/bill-section-c-values.component";
import { BillAttachmentsComponent } from "./new-reusable-components/bill-attachments/bill-attachments.component";
import { EefcComponent } from "./trade-flow/eefc/eefc.component";
import { AddNewEefcComponent } from "./trade-flow/eefc/add-new-eefc/add-new-eefc.component";
import { ExportBillDispatchSummaryComponent } from "./trade-flow/export-bill-dispatch-summary/export-bill-dispatch-summary.component";
import { TransactionDetailsComponent } from "./new-reusable-components/transaction-details/transaction-details.component";
import { DispatchDocumentsComponent } from "./new-reusable-components/dispatch-documents/dispatch-documents.component";
import { PaymentRequestEnquiryComponent } from './new-reusable-components/payment-request-enquiry/payment-request-enquiry.component';

import { BillProcessingSummaryComponent } from "./trade-flow/bill-processing-summary/bill-processing-summary.component";
import { DocumentAcceptanceComponent } from "./new-reusable-components/document-acceptance/document-acceptance.component";
import { BeneficiaryDetailsComponent } from "./new-reusable-components/beneficiary-details/beneficiary-details.component";
import { RemittanceDetailsComponent } from "./new-reusable-components/remittance-details/remittance-details.component";
import { OrdersInfoComponent } from "./new-reusable-components/orders-info/orders-info.component";
import { BillDocumentsComponent } from "./new-reusable-components/bill-documents/bill-documents.component";
import { BuyersCreditSummaryComponent } from "./trade-flow/buyers-credit-summary/buyers-credit-summary.component";
import { GenericBuyerCreditComponent } from "./new-reusable-components/generic-buyer-credit/generic-buyer-credit.component";
import { CustomerInfoComponent } from "./new-reusable-components/customer-info/customer-info.component";
import { SupplierInfoComponent } from "./new-reusable-components/supplier-info/supplier-info.component";
import { CreditInfoComponent } from "./new-reusable-components/credit-info/credit-info.component";
import { GenericExportBillDispatchComponent } from './new-reusable-components/generic-export-bill-dispatch/generic-export-bill-dispatch.component';

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
    LcInfoComponent,
    GoodsInfoComponent,
    LcAdditionalInfoComponent,
    LcOtherConditionsComponent,
    FeeAccountComponent,
    AmendmentLcInfoComponent,
    LcAmendementInfoComponent,
    RemittanceSummeryComponent,
    GenericRemittanceComponent,
    RemittanceInfoComponent,
    PreShipmentLPSummaryComponent,
    ExportProcessInfoComponent,
    ExportApplicationDetailsComponent,
    ExportLoanDetailsComponent,
    ExportAttachmentsComponent,
    ExportLcDetailsComponent,
    ExportBillDispatchSummaryComponent,
    TransactionDetailsComponent,
    DispatchDocumentsComponent,
    ExportSWBillLodgementComponent,
    AddExportSwBillComponent,
    BillSectionAComponent,
    BillSectionBComponent,
    BillSectionCValuesComponent,
    BillAttachmentsComponent,
    EefcComponent,
    AddNewEefcComponent,
    ExportBillDispatchSummaryComponent,
    TransactionDetailsComponent,
    DispatchDocumentsComponent,
    BillProcessingSummaryComponent,
    DocumentAcceptanceComponent,
    BeneficiaryDetailsComponent,
    RemittanceDetailsComponent,
    OrdersInfoComponent,
    BillDocumentsComponent,
    BuyersCreditSummaryComponent,
    GenericBuyerCreditComponent,
    CustomerInfoComponent,
    SupplierInfoComponent,
    CreditInfoComponent,

    GenericExportBillDispatchComponent,

    PaymentRequestEnquiryComponent,

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
