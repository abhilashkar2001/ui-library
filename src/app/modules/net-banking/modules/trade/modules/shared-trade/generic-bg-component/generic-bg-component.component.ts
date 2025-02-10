import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { WebhostDirective } from 'app/shared/directives/appHost.directive';
import { BehaviorSubject } from 'rxjs';
import { GenericBgServiceService } from './generic-bg-service.service';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-generic-bg-component',
  templateUrl: './generic-bg-component.component.html',
  styleUrls: ['./generic-bg-component.component.scss'],
})
export class GenericBgComponentComponent {
  @Input() componentName = '';
  tabs: any;
  account$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  tradeDetails: BehaviorSubject<any> = new BehaviorSubject<any>({});
  shareTradeDetails = this.tradeDetails.asObservable();
  currentStep$: BehaviorSubject<any> = new BehaviorSubject(null);
  isCurrentFormValid$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );
  @ViewChild(WebhostDirective, { static: true })
  host!: WebhostDirective;
  componentRef: any;
  bgType: any;
  constructor(
    private router: Router,
    private api: GenericBgServiceService,
    private sessionStorageService: SessionStorageService,
  ) {}

  createComponentView() {
    const view = this.host.viewContainerRef;
    view.clear();
    if (this.currentStep$.value?.componrnt) {
      this.componentRef = view.createComponent(
        this.currentStep$.value.componrnt,
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
  navigatetotab(tab: any) {
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

  saveTemplate(templateName: any) {
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
    this.api.saveTemplate(payload).subscribe(() => {});
  }

  updateRecord() {
    let payload;
    if (this.currentStep$?.value?.id == 1) {
      const applicantInfo = this.account$.value?.applicantInfo;
      payload = {
        lcType: 'Issuance',
        applicantInfo: {
          applicant: applicantInfo?.applicant,
          applicantReference: applicantInfo?.applicantReferences,
          customerCode: applicantInfo?.customerCode,
          issuingBranchId: applicantInfo?.issuingBranchCode,
          iecCode: applicantInfo?.iecCode,
          devliveryVia: applicantInfo?.deliveryMode,
          margin: applicantInfo?.margin,
          feeAccount: applicantInfo?.feeAccount,
          contact: {
            address: applicantInfo?.contactInfo?.address?.map((i: any) => ({
              address1: i?.address1,
              address2: i?.address2,
              addressType: i?.residenceType,
              pincode: i?.pincode,
              cityId: i?.cityId,
            })),
          },
        },
      };
    } else if (this.currentStep$.value?.id == 2) {
      const lcInfo = this.account$.value?.lcInfo;
      payload = {
        lcType: 'Issuance',
        lcMasterId: this.sessionStorageService.getLcMasterId(),
        lcInfo: {
          type: lcInfo?.type,
          domesticOrForeignLc: lcInfo?.domesticOrForegin === 'domesticLC',
          redClause: lcInfo?.redClause == 'true',
          revolving: lcInfo?.revolving == 'true',
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
              address: lcInfo?.beneficiaryDetails?.address?.map((i: any) => ({
                address1: i?.address1,
                address2: i?.address2,
                addressType: 'Home',
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
              address: lcInfo?.bankDetails?.address?.map((i: any) => ({
                address1: i?.address1,
                address2: i?.address2,
                addressType: 'Home',
                pincode: i?.pincode,
                cityId: i?.cityId,
              })),
            },
          },
        },
      };
    } else if (this.currentStep$.value?.id == 3) {
      payload = {
        lcType: 'Issuance',
        lcMasterId: this.sessionStorageService.getLcMasterId(),
        ...this.account$?.value?.goodsInfo,
      };
    } else if (this.currentStep$.value?.id == 4) {
      payload = {
        lcType: 'Issuance',
        lcMasterId: this.sessionStorageService.getLcMasterId(),
        documentInfo: {
          documentId: this.account$.value?.documentId,
        },
      };
    } else if (this.currentStep$.value?.id == 5) {
      const lcAdditionalInfo = this.account$.value?.lcAdditionalInfo;
      payload = {
        lcType: 'Issuence',
        lcMasterId: this.sessionStorageService.getLcMasterId(),
        additionalInfo: {
          lcTransfer: lcAdditionalInfo?.lcTransfer === 'Yes',
          additionalCondition: lcAdditionalInfo?.additionalCondition,
          advisingBank: {
            advThroughBank: lcAdditionalInfo?.bankAdvise,
            branchId: lcAdditionalInfo?.branchCode,
            chgOthrThanIssuingBnkChg:
              lcAdditionalInfo?.allChargesThanBankCharge,
            remarksToBank: lcAdditionalInfo?.remarks,
            contact: {
              address: lcAdditionalInfo?.contactInfo?.address?.map(
                (i: any) => ({
                  address1: i?.address1,
                  address2: i?.address2,
                  addressType: i?.residenceType,
                  pincode: i?.pincode,
                  cityId: i?.cityId,
                }),
              ),
            },
          },
        },
      };
    } else if (this.currentStep$.value?.id == 6) {
      payload = {
        lcType: 'Issuence',
        lcMasterId: this.sessionStorageService.getLcMasterId(),
        attachment: {
          documentIds: this.account$.value?.attachMentModel?.map(
            (i: any) => i?.documentId,
          ),
        },
      };
    }

    this.api.submitIssuance(payload).subscribe((resp: any) => {
      console.log(resp);
      if (resp?.data?.lcMasterId && this.currentStep$.value?.id == 1) {
        this.account$.value.lcMasterId = resp?.data?.lcMasterId;
        this.sessionStorageService.setLcMasterId(resp?.data?.lcMasterId);
      }
    });

    const nextTab = this.tabs.find(
      (i: any) => i?.id == this.currentStep$?.value?.id + 1,
    );

    if (nextTab?.id) {
      this.navigatetotab(nextTab);
    } else {
      this.router.navigateByUrl(
        '/user/dashboard/trade/bgSummary?type=LC%20Issuance',
      );
    }
  }

  trackRecord() {
    this.tradeDetails.next(this.account$.value);
  }
}
