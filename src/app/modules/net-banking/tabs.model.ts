import { AmendementInfoComponent } from "./new-reusable-components/amendement-info/amendement-info.component";
import { AmendmentLcInfoComponent } from "./new-reusable-components/amendment-lc-info/amendment-lc-info.component";
import { ApplicantsInfoComponent } from "./new-reusable-components/applicants-info/applicants-info.component";
import { AttachmentsComponent } from "./new-reusable-components/attachments/attachments.component";
import { BeneficiaryDetailsComponent } from "./new-reusable-components/beneficiary-details/beneficiary-details.component";
import { BgInfoComponent } from "./new-reusable-components/bg-info/bg-info.component";
import { BillAttachmentsComponent } from "./new-reusable-components/bill-attachments/bill-attachments.component";
import { BillSectionAComponent } from "./new-reusable-components/bill-section-a/bill-section-a.component";
import { BillSectionBComponent } from "./new-reusable-components/bill-section-b/bill-section-b.component";
import { BillSectionCValuesComponent } from "./new-reusable-components/bill-section-c-values/bill-section-c-values.component";

import { DispatchDocumentsComponent } from "./new-reusable-components/dispatch-documents/dispatch-documents.component";

import { BillDocumentsComponent } from "./new-reusable-components/bill-documents/bill-documents.component";
import { DocumentAcceptanceComponent } from "./new-reusable-components/document-acceptance/document-acceptance.component";
import { CreditInfoComponent } from "./new-reusable-components/credit-info/credit-info.component";
import { CustomerInfoComponent } from "./new-reusable-components/customer-info/customer-info.component";

import { GoodsInfoComponent } from "./new-reusable-components/goods-info/goods-info.component";
import { LcAdditionalInfoComponent } from "./new-reusable-components/lc-additional-info/lc-additional-info.component";
import { LcAmendementInfoComponent } from "./new-reusable-components/lc-amendement-info/lc-amendement-info.component";
import { LcInfoComponent } from "./new-reusable-components/lc-info/lc-info.component";
import { LcOtherConditionsComponent } from "./new-reusable-components/lc-other-conditions/lc-other-conditions.component";
import { OrdersInfoComponent } from "./new-reusable-components/orders-info/orders-info.component";
import { OthersInfoComponent } from "./new-reusable-components/others-info/others-info.component";
import { RemittanceDetailsComponent } from "./new-reusable-components/remittance-details/remittance-details.component";
import { RemittanceInfoComponent } from "./new-reusable-components/remittance-info/remittance-info.component";

import { TransactionDetailsComponent } from "./new-reusable-components/transaction-details/transaction-details.component";

import { SupplierInfoComponent } from "./new-reusable-components/supplier-info/supplier-info.component";

import { UploadBulkUploadComponent } from "./new-reusable-components/upload-bulk-upload/upload-bulk-upload.component";
import { exportBillDispatchData } from "./trade-flow/export-bill-dispatch-summary/exportbillstaticdata";

export class tabsClass {
  public static Bg_Issuance: any[] = [
    {
      id: 1,
      title: "Applicant's Info",
      type: "BG Issuance",
      componrnt: ApplicantsInfoComponent,
    },
    {
      id: 2,
      title: "BG Info",
      type: "BG Issuance",
      componrnt: BgInfoComponent,
    },
    {
      id: 3,
      title: "Other Info",
      type: "BG Issuance",
      componrnt: OthersInfoComponent,
    },
    {
      id: 4,
      title: "Attachemnts",
      type: "BG Issuance",
      componrnt: AttachmentsComponent,
    },
  ];
  public static Bg_Amendment: any[] = [
    {
      id: 1,
      title: "BG Info",
      type: "BG Amendment",
      componrnt: BgInfoComponent,
    },
    {
      id: 2,
      title: "Amendment Info",
      type: "BG Amendment",
      componrnt: AmendementInfoComponent,
    },
    {
      id: 3,
      title: "Other Info",
      type: "BG Amendment",
      componrnt: OthersInfoComponent,
    },
    {
      id: 4,
      title: "Attachemnts",
      type: "BG Amendment",
      componrnt: AttachmentsComponent,
    },
  ];
  public static Bg_PhysicalAmendment: any[] = [
    {
      id: 1,
      title: "Amendment Info",
      type: "BG Physical Amendment",
      componrnt: AmendementInfoComponent,
    },
    {
      id: 2,
      title: "Attachemnts",
      type: "BG Physical Amendment",
      componrnt: AttachmentsComponent,
    },
  ];
  public static Lc_Issuance: any[] = [
    {
      id: 1,
      title: "Applicant's Info",
      type: "LC Issuance",
      componrnt: ApplicantsInfoComponent,
    },
    {
      id: 2,
      title: "LC Info",
      type: "LC Issuance",
      componrnt: LcInfoComponent,
    },
    {
      id: 3,
      title: "Goods Info",
      type: "LC Issuance",
      componrnt: GoodsInfoComponent,
    },
    {
      id: 4,
      title: "Documents Info (46 A)",
      type: "LC Issuance",
      isHideFilter: true,
      isHideButton: true,
      componrnt: UploadBulkUploadComponent,
    },
    {
      id: 5,
      title: "Additional Info",
      type: "LC Issuance",
      componrnt: LcAdditionalInfoComponent,
    },
    {
      id: 6,
      title: "Attachments",
      type: "LC Issuance",
      componrnt: AttachmentsComponent,
    },
  ];

  public static Lc_PhysicalAmendment: any[] = [
    {
      id: 1,
      title: "Amendment Info",
      type: "LC Physical Amendment",
      componrnt: LcAmendementInfoComponent,
    },
    {
      id: 2,
      title: "Attachements",
      type: "LC Physical Amendment",
      componrnt: AttachmentsComponent,
    },
  ];

  public static LC_Amendment: any[] = [
    {
      id: 1,
      title: "LC Info",
      type: "LC Amendment",
      componrnt: AmendmentLcInfoComponent,
    },
    {
      id: 2,
      title: "Amendment Info",
      type: "LC Amendment",
      componrnt: LcAmendementInfoComponent,
    },
    {
      id: 3,
      title: "Other Conditions",
      type: "LC Amendment",
      componrnt: LcOtherConditionsComponent,
    },
    {
      id: 4,
      title: "Attachments",
      type: "LC Amendment",
      componrnt: AttachmentsComponent,
    },
  ];

  public static readonly Remittance: any[] = [
    {
      id: 1,
      title: "Applicant Info",
      type: "Remittamce_Applicant_Info",
      componrnt: ApplicantsInfoComponent,
    },
    {
      id: 2,
      title: "Remittance Info",
      type: "Remittamce_Remittance_Info",
      componrnt: RemittanceInfoComponent,
    },
    {
      id: 3,
      title: "Other Info",
      type: "Remittamce_Other_Info",
      componrnt: OthersInfoComponent,
    },
    {
      id: 4,
      title: "Attachments",
      type: "Remittamce_Attachments",
      componrnt: AttachmentsComponent,
    },
  ];

  public static readonly exportBillDispatchData: any[] = [
    {
      id: 1,
      title: "Transaction Details",
      type: "Export_Transaction_Details",
      componrnt: TransactionDetailsComponent,
    },
    {
      id: 2,
      title: "Dispatch Documents",
      type: "Dispatch_Documents_Details",
      componrnt: DispatchDocumentsComponent,
    },
  ];


  public static readonly BuyersCredit: any[] = [
    {
      id: 1,
      title: "Customer Info",
      type: "Buyer_Customer_Info",
      componrnt: CustomerInfoComponent
    },
    {
      id: 2,
      title: "Supplier Info",
      type: "Buyer_Supplier_Info",
      componrnt: SupplierInfoComponent
    },
    {
      id: 3,
      title: "Credit Info",
      type: "Buyer_Credit_Info",
      componrnt: CreditInfoComponent
    },
    {
      id: 4,
      title: "Other Info",
      type: "Buyer_Other_Info",
      componrnt: OthersInfoComponent
    },
    {
      id: 5,
      title: "Attachments",
      type: "Remittamce_Attachments",
      componrnt: AttachmentsComponent
    },
  ]
  public static readonly ExportSWBill:any[] = [
    {
      id: 1,
      title: "Section A",
      type: "Export S/W Bill Lodgement",
      componrnt: BillSectionAComponent
    },
    {
      id: 2,
      title: "Section B",
      type: "Export S/W Bill Lodgement",
      componrnt: BillSectionBComponent
    },
    {
      id: 3,
      title: "Section C & Values",
      type: "Export S/W Bill Lodgement",
      componrnt: BillSectionCValuesComponent
    },
    {
      id: 4,
      title: "Attachments",
      type: "Export S/W Bill Lodgement",
      componrnt: BillAttachmentsComponent
    },
  ]
  public static readonly documentAcceptance:any[] = [
    {
      id: 1,
      title: "Beneficiary Details",
      type: "Document_Acceptance_Info",
      componrnt: BeneficiaryDetailsComponent
    },
    {
      id: 2,
      title: "Remittance Details",
      type: "Remittamce_Details",
      componrnt: RemittanceDetailsComponent
    },
    {
      id: 3,
      title: "Order Info",
      type: "Remittamce_Order_Info",
      componrnt: OrdersInfoComponent
    },
    {
      id: 4,
      title: "Document",
      type: "Remittamce_Attachments",
      componrnt: BillDocumentsComponent
    },
  ];

}
