import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AddNewPopupComponent } from "app/shared/components/add-new-popup/add-new-popup.component";
import { Webhost } from "app/shared/directives/appHost.directive";
import { BehaviorSubject } from "rxjs";
import { GenericBgServiceService } from "./generic-bg-service.service";

@Component({
  selector: "app-generic-bg-component",
  templateUrl: "./generic-bg-component.component.html",
  styleUrls: ["./generic-bg-component.component.scss"],
})
export class GenericBgComponentComponent implements OnInit {
  @Input("componentName") componentName = "";
  tabs: any;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  tradeDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  shareTradeDetails = this.tradeDetails.asObservable();
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  @ViewChild(Webhost, { static: true })
  host!: Webhost;
  componentRef: any;
  bgType: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private api: GenericBgServiceService
  ) {}

  ngOnInit(): void {}

  createComponentView() {
    const view = this.host.viewContainerRef;
    view.clear();
    if (this.currentStep$.value?.componrnt) {
      this.componentRef = view.createComponent(
        this.currentStep$.value.componrnt
      );
      this.componentRef.instance.bgType = this.bgType;
      this.currentStep$.subscribe((resp) => {
        if (resp?.isHideFilter) {
          this.componentRef.instance.isHideFilter = resp.isHideFilter;
          this.componentRef.instance.isHideButton = resp.isHideButton;
          this.componentRef.instance.screenName = resp.title;
        }
      });

      this.shareTradeDetails.subscribe((resp) => {
        this.componentRef.instance.tradeDetails = resp;
      });
      this.componentRef.instance.updateParentModel = this.updateAccount;
      this.componentRef.instance.amendmentType = this.currentStep$.value?.type;
    }
  }
  navigatetotab(tab) {
    this.trackRecord();
    this.currentStep$.next(tab);
    this.createComponentView();
  }

  updateAccount = (part: Partial<any>, isFormValid: boolean) => {
    const currentAccount = this.account$.value;
    const updatedAccount = { ...currentAccount, ...part };
    this.account$.next(updatedAccount);
    this.isCurrentFormValid$.next(isFormValid);
  };

  saveTemplet(event) {
    const dialogRef = this.dialog.open(AddNewPopupComponent, {
      data: {
        isSaveTemplate: true,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      this.saveTemplate(resp.templateName);
    });
  }

  saveTemplate(templateName) {
    const payload = {
      applicantModel: {
        ...this.account$.value.applicantInfo,
        saveTemplate: true,
        templateName: templateName,
      },
      bgInfoModel: this.account$.value?.benificiaryDetails ?? null,
      otherInfoModel: this.account$.value?.otherInfoModel ?? null,
      attachmentModel: this.account$.value?.attachMentModel ?? null,
    };
    this.api.saveTemplate(payload).subscribe((resp) => {});
  }

  updateRecord(event) {
    console.log(
      event,
      "........",
      this.currentStep$.value?.id,
      this.account$.value
    );

    let payload;
    if (this.currentStep$?.value?.id == 1) {
      const applicantInfo = this.account$.value?.applicantInfo;
      const applicantInfoPayload = {
        lcType: "Issuance",
        applicantInfo: {
          applicant: applicantInfo?.applicant,
          applicantReference: applicantInfo?.applicantReferences,
          customerCode: applicantInfo?.customerCode,
          issuingBranchId: applicantInfo?.issuingBranchCode,
          iecCode: applicantInfo?.iecCode,
          devliveryVia: applicantInfo?.deliveryMode,
          margin: applicantInfo?.margin,
          // licenceOglOrNonOgl: applicantInfo?.,
          feeAccount: applicantInfo?.feeAccount,
          contact: {
            address: applicantInfo?.contactInfo?.address?.map((i) => ({
              address1: i?.address1,
              address2: i?.address2,
              addressType: i?.residenceType,
              pincode: i?.pincode,
              cityId: i?.cityId,
            })),
          },
        },
      };
      payload = applicantInfoPayload;
    } else if (this.currentStep$.value?.id == 2) {
      const lcInfo = this.account$.value?.lcInfo;
      const lcInfopayload = {
        lcType: "Issuance",
        lcMasterId: sessionStorage.getItem("lcMasterId"),
        lcInfo: {
          type: lcInfo?.type,
          domesticOrForeignLc: lcInfo?.domesticOrForegin === "domesticLC",
          redClause: lcInfo?.redClause == "true",
          revolving: lcInfo?.revolving == "true",
          amount: Number(lcInfo?.amount),
          maxCrAmtOrTolerance: lcInfo?.tolerance,
          additionalAmounts: Number(lcInfo?.additionalAmounts),
          valueDate: lcInfo?.valueDate,
          requestDate: lcInfo?.requestDate,
          purpose: lcInfo?.purpose,
          placeOfExpiry: lcInfo?.placeOfExpiry,
          expiryDate: lcInfo?.expiryDate,
          creditAvailableWith: lcInfo?.creditAvailable,
          by: lcInfo?.by,
          defferedPaymentDetails: lcInfo?.defferedPaymentDetails,
          forPercentage: lcInfo?.invoiceValue,
          ofInvoiceValue: Number(lcInfo?.invoiceValue),
          tenor: lcInfo?.tenor,
          currencyId: lcInfo?.currency,
          beneficiary: {
            name: lcInfo?.beneficiaryDetails?.beneficiary,
            contactInfo: {
              address: lcInfo?.beneficiaryDetails?.address?.map((i) => ({
                address1: i?.address1,
                address2: i?.address2,
                addressType: "Home",
                pincode: i?.pincode,
                cityId: i?.cityId,
              })),
            },
          },
          bankDetails: {
            // deliveryVia: lcInfo?.bankDetails?.,
            confOfCredit: lcInfo?.bankDetails?.confirmationOfCredit == true,
            drawee: lcInfo?.bankDetails?.drawee,
            branchId: lcInfo?.bankDetails?.branch,
            contact: {
              address: lcInfo?.bankDetails?.address?.map((i) => ({
                address1: i?.address1,
                address2: i?.address2,
                addressType: "Home",
                pincode: i?.pincode,
                cityId: i?.cityId,
              })),
            },
          },
        },
      };
      payload = lcInfopayload;
    } else if (this.currentStep$.value?.id == 3) {
      payload = {
        lcType: "Issuance",
        lcMasterId: sessionStorage.getItem("lcMasterId"),
        ...this.account$?.value?.goodsInfo,
      };
    } else if (this.currentStep$.value?.id == 4) {
      const docPayload = {
        lcType: "Issuance",
        lcMasterId: sessionStorage.getItem("lcMasterId"),
        documentInfo: {
          documentId: this.account$.value?.documentId,
        },
      };
      payload = docPayload;
    } else if (this.currentStep$.value?.id == 5) {
      const lcAdditionalInfo = this.account$.value?.lcAdditionalInfo;
      const additionalPayload = {
        lcType: "Issuence",
        lcMasterId: sessionStorage.getItem("lcMasterId"),
        additionalInfo: {
          lcTransfer: lcAdditionalInfo?.lcTransfer === "Yes",
          additionalCondition: lcAdditionalInfo?.additionalCondition,
          advisingBank: {
            advThroughBank: lcAdditionalInfo?.bankAdvise,
            branchId: lcAdditionalInfo?.branchCode,
            chgOthrThanIssuingBnkChg:
              lcAdditionalInfo?.allChargesThanBankCharge,
            remarksToBank: lcAdditionalInfo?.remarks,
            contact: {
              address: lcAdditionalInfo?.contactInfo?.address?.map((i) => ({
                address1: i?.address1,
                address2: i?.address2,
                addressType: i?.residenceType,
                pincode: i?.pincode,
                cityId: i?.cityId,
              })),
            },
          },
        },
      };
      payload = additionalPayload;
    } else if (this.currentStep$.value?.id == 6) {
      const attachmentPayload = {
        lcType: "Issuence",
        lcMasterId: sessionStorage.getItem("lcMasterId"),
        attachment: {
          documentIds: this.account$.value?.attachMentModel?.map(
            (i) => i?.documentId
          ),
        },
      };
      payload = attachmentPayload;
    }

    this.api.submitIssuance(payload).subscribe(
      (resp: any) => {
        console.log(resp);
        if (resp?.data?.lcMasterId && this.currentStep$.value?.id == 1) {
          this.account$.value.lcMasterId = resp?.data?.lcMasterId;
          sessionStorage.setItem("lcMasterId", resp?.data?.lcMasterId);
        }
      },
      (err) => console.error("Error: ", err)
    );

    const nextTab = this.tabs.find(
      (i) => i?.id == this.currentStep$?.value?.id + 1
    );

    if (nextTab?.id) {
      this.navigatetotab(nextTab);
    } else {
      this.router.navigateByUrl(
        "/user/dashboard/trade/bgSummary?type=LC%20Issuance"
      );
    }
  }

  trackRecord() {
    this.tradeDetails.next(this.account$.value);
  }
}
