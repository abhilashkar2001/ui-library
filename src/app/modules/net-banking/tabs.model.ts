import { AmendementInfoComponent } from "./new-reusable-components/amendement-info/amendement-info.component";
import { ApplicantsInfoComponent } from "./new-reusable-components/applicants-info/applicants-info.component";
import { AttachmentsComponent } from "./new-reusable-components/attachments/attachments.component";
import { BgInfoComponent } from "./new-reusable-components/bg-info/bg-info.component";
import { GoodsInfoComponent } from "./new-reusable-components/goods-info/goods-info.component";
import { LcAdditionalInfoComponent } from "./new-reusable-components/lc-additional-info/lc-additional-info.component";
import { LcInfoComponent } from "./new-reusable-components/lc-info/lc-info.component";
import { OthersInfoComponent } from "./new-reusable-components/others-info/others-info.component";
import { UploadBulkUploadComponent } from "./new-reusable-components/upload-bulk-upload/upload-bulk-upload.component";

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
}
