import { CommonPersonalDetailsComponent } from "app/shared/components/common-personal-details/common-personal-details.component";
import { CommonMobileVerificationComponent } from "app/shared/components/comon-mobile-verification/common-mobile-verification.component";
import { CompanyInformationComponent } from "app/shared/components/company-information/company-information.component";
import { DigitalSignComponent } from "app/shared/components/digital-sign/digital-sign.component";
import { NationalIdUploadComponent } from "app/shared/components/national-id-upload/national-id-upload.component";
import { OtherChecklistDocUploadComponent } from "app/shared/components/other-checklist-doc-upload/other-checklist-doc-upload.component";
import { OtherDocumentsComponent } from "app/shared/components/other-documents/other-documents.component";

export class CreateAccountConstant {
  static readonly SCREEN_NAME = "Common";

  static readonly STATIC_DATA = {
    OWNERSHIP: [],
  };

  static readonly DYNAMIC_SCREEN = [
    {
      id: 1,
      key: "mobile",
      type: "Create Account",
      component: CommonMobileVerificationComponent,
    },
    {
      id: 2,
      key: "personal",
      type: "Create Account",
      component: CommonPersonalDetailsComponent,
    },
    {
      id: 2,
      key: "national",
      type: "Create Account",
      component: NationalIdUploadComponent,
    },
    {
      id: 2,
      key: "company",
      type: "Company Information",
      component: CompanyInformationComponent,
    },
    {
      id: 3,
      key: "document",
      type: "Create Account",
      component: OtherChecklistDocUploadComponent,
    },
    {
      id: 4,
      key: "signature",
      type: "Signature",
      component: DigitalSignComponent,
    },
    {
      id: 5,
      key: "director",
      type: "Create Loan",
      component: CommonPersonalDetailsComponent,
    },
  ];
}

export enum CreateEnum {
  SELF = "Self",
  OWNERSHIP = "OWNERSHIP",
  DUPLICATE_PRODUCT_ERROR_MESSAGE = "We have found similar account application in our record on your Mobile Number",
  DUPLICATE_PRODUCT_HINT = "Please visit bank for more information.",
  PRODUCT_DUPLICATION_KEY = "Accounts",
  SOURCE_PAYLOAD_KEY = "Website",
  LOADING_TEXT = "Saved",
}
