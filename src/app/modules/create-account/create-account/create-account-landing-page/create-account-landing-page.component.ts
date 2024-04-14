import { ChangeDetectorRef, Component, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { ErrorNotifierPopupComponent } from "app/shared/components/error-notifier-popup/error-notifier-popup.component";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SharedService } from "app/shared/shared.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { CreateAccountConstant, CreateEnum } from "./create-account.constant";
import { AppHostDirective } from "app/shared/directives/app-host.directive";

const {
  SELF,
  OWNERSHIP,
  DUPLICATE_PRODUCT_ERROR_MESSAGE,
  DUPLICATE_PRODUCT_HINT,
  PRODUCT_DUPLICATION_KEY,
  SOURCE_PAYLOAD_KEY,
  LOADING_TEXT,
} = CreateEnum;

@Component({
  selector: "app-create-account-landing-page",
  templateUrl: "./create-account-landing-page.component.html",
  styleUrls: ["./create-account-landing-page.component.scss"],
})
export class CreateAccountLandingPageComponent {
  stepper: MatStepper;
  screenList: any;
  screenTitle = "";
  selectedStep: number = 0;
  currentStep: string;
  originationId: any;
  basisId: any;
  productDetails: any;
  processDetails: { processCycleCode: string; processStageId: number };
  personalDetails: any = [];
  ownership: any;
  screenName: string = CreateAccountConstant.SCREEN_NAME;
  staticData = CreateAccountConstant.STATIC_DATA;
  ownershipId: any;
  currentUser: any;
  currencyCode: any;
  isHideField: boolean = true;
  personalDoc: any[] = [];
  isLoading: boolean = false;
  dynamicScreen = CreateAccountConstant.DYNAMIC_SCREEN;
  @ViewChild("container") container: any;
  @ViewChild(AppHostDirective, { static: true }) appAppHost: AppHostDirective;
  componentRef: any;
  currentComponentInfo: any;
  existingCustomerId: number;
  mobileVerifyInfo = {
    basisName: "",
    productDuplicationKey: PRODUCT_DUPLICATION_KEY,
    applicationType: "Create Account application",
  };
  originationModel: any;

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private loanApi: LoanService,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private cdr: ChangeDetectorRef
  ) {
    // this.showSideBar.setToken(true);
    commonService.updateData(router.url);
  }

  showComponent(screenName) {
    this.dynamicScreen.forEach((item: any) => {
      if (screenName.toLowerCase().includes(item.key)) {
        this.currentComponentInfo = { ...item };
        const view = this.appAppHost.viewContainerRef;
        view.clear();
        setTimeout(() => {
          this.componentRef = view.createComponent(item.component);

          // for mobile number.
          this.componentRef.instance.mobileVerifyInfo = this.mobileVerifyInfo;

          // for personal details.
          this.componentRef.instance.isHideField = this.isHideField;
          this.componentRef.instance.basisId = this.basisId;
          this.componentRef.instance.personalDetails = this.personalDetails;

          // for personal doc.
          this.componentRef.instance.personalDoc = this.personalDoc;

          this.componentRef.instance.updateParentModel = this.updateAccount;

          this.componentRef.instance?.onBackEvent.subscribe((_) => {
            this.goBack();
          });
        });
      }
    });
  }

  ngOnInit(): void {
    this.currentUser = this.tokenStore.getUser();
    this.getGeneric();
    this.currencyCode = this.tokenStore.getUserOtherInfo();
    this.basisId = this.route.snapshot.params["id"];
    this.getProductDetails();
    var sessionStep = sessionStorage.getItem("accountstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    const sessionData = JSON.parse(localStorage.getItem("basisDetails"));
    this.openAccountService
      .getProcessCycle(sessionData.processCycleCode)
      .subscribe((resp) => {
        this.processDetails = {
          processCycleCode: resp.data.processCycleCode,
          processStageId: resp.data.processStageList[0]?.id,
        };

        this.getScreenDetails(resp);
      });
    //this is for existing customer.
    this.existingCustomerId = parseInt(
      sessionStorage.getItem("userCustomerId")
    );
    //this is for staging customer. we checking 1st staging id avilable, if not then checking existing cust Id.
    let customStageId = parseInt(sessionStorage.getItem("customerStageId"));
    var originationId = sessionStorage.getItem("originationId");
    if (originationId) this.getOriginationMaster(parseInt(originationId));
    else if (customStageId) {
      this.getCustomerbyStageId(customStageId);
    } else if (this.existingCustomerId) {
      this.getCustomerById(this.existingCustomerId);
    }
  }

  getOriginationMaster(originationId) {
    this.openAccountService
      .getOriginationMaster(originationId)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data[0]?.customerInfo;
          this.originationId = resp.data[0].originationModel.originationId;
          this.originationModel = resp.data[0]?.originationModel;
          // this.componentRef.instance.personalDetails = this.personalDetails;
          this.cdr.detectChanges();
        }
      });
  }

  /**
   * it will check the updateMasterSave key if its true it will call master-save or else it will move to next screen.
   * @param value inputValue of child screen
   */
  updateAccount = (value: Partial<any>) => {
    const sessionData = JSON.parse(localStorage.getItem("basisDetails"));
    let originationModel = {
      applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
      originationId: this.originationModel?.originationId ?? null,
      accountType: sessionData.accountType,
      basisDetailsId: sessionData.basisDetailsId,
      branchCode: this.tokenStore.getUser().branchCode,
      source: SOURCE_PAYLOAD_KEY,
      businessProductName: this.productDetails.basisName,
      productDescription: this.productDetails.basisDetailStory,
      ownership: this.ownershipId,
      currencyCode: this.currencyCode?.currency,
      branchId: this.currentUser.branchId,
    };
    if (value.personalDetails)
      this.personalDetails = value.personalDetails.customer;
    let customerInfo = this.modelFactoryForCustomer(
      this.personalDetails,
      value?.kycDoc ?? []
    );
    if (value.updateMasterSave) {
      this.getMasterSave({
        originationModel: originationModel,
        customerInfo: customerInfo,
      });
    } else this.next();
  };

  /**
   *
   * @param customerInfo is a customerInfo model
   * @param docIds is a document model
   * @returns payload of customerInfo.
   */
  modelFactoryForCustomer(customerInfo, docIds) {
    let custResp: any = [...customerInfo];
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      custResp[0].primaryCustomer = true; //Need to remove lator while multiple customer
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
      delete custResp[i].documentsInfoModel;
      delete custResp[i].signatureInfo;
      if (!custResp[i]?.customerStagingId) {
        custResp[i].contact.contactId = null;
        custResp[i].contact.address[i].addressId = null;
        delete custResp[i].customerStagingId;
      }

      custResp[i].isphoneNumVerified = true;
      custResp[i].isEmailVerified = true;
      custResp[i].customerNo = null;
      custResp[i].customerId = null;

      const customerId = sessionStorage.getItem("userCustomerId");
      if (customerId) {
        delete custResp[i].existingCustomerId;
        custResp[i].customerId = parseInt(customerId);
      } else {
        delete custResp[i].existingCustomerId;
        custResp[i].customerId = null;
      }
    });

    return custResp;
  }

  /**
   * Here api call for master save & updating origination model with originationId.
   * NOTE :- Once Workflow formulla Ready thn conditionally need to add verifyWorkflow api.
   * @param payload
   */
  getMasterSave(payload) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.originationId = resp.data.originationModel.originationId;
        sessionStorage.setItem(
          "originationId",
          resp?.data?.originationModel?.originationId
        );
        this.originationModel = resp.data[0]?.originationModel;
        //Note:- properties should be update once complete forumulla list recieves & we ned to call a verify Workflow api,
        //        dynamically wherever it has been asked.
        this.next();
      }
    });
  }

  getCustomerbyStageId(customStageId) {
    this.openAccountService
      .getCustByStageId(parseInt(customStageId))
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data;
          // if (resp.data[0].primaryCustomer)
          this.personalDoc = resp.data[0].documnentsInfo?.documents ?? [];
        } else if (resp?.statusCode === 204) this.personalDetails = [];
      });
  }

  getGeneric() {
    this.sharedService
      .genericValue(this.screenName, Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          this.ownership = resp.data[OWNERSHIP];
          this.ownershipId = this.ownership.find(
            (r) => r?.values.toLowerCase() === "self"
          )?.id;
        }
      });
  }

  getCustomerById(customerId) {
    this.openAccountService.getCustomerById(customerId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.personalDetails = resp.data;
      }
    });
  }

  getScreenDetails(resp) {
    this.openAccountService
      .getProcessStages(resp.data.processStageList[0].id)
      .subscribe((response) => {
        this.screenList = response.data.screens.sort((s1, s2) => {
          return s1.sequence - s2.sequence;
        });
        sessionStorage.setItem(
          "currentAccountStage",
          resp.data.processStageList[0].id
        );
        this.factory();
      });
  }

  /**
   * api call for getting product details by basisId
   */
  getProductDetails() {
    this.openAccountService
      .getProductDetails(this.basisId)
      .subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.productDetails = resp.data[0];
          this.screenTitle = resp.data[0].basisName;
          this.mobileVerifyInfo = {
            ...this.mobileVerifyInfo,
            basisName: this.productDetails.basisName,
          };
        }
      });
  }

  factory() {
    this.currentStep = this.screenList[this.selectedStep].screenName;
    this.showComponent(this.currentStep);
  }

  next() {
    const num = this.selectedStep + 1;
    if (num === this.screenList?.length && num > 0) {
      this.done();
      return;
    } else {
      this.selectedStep = num;
      sessionStorage.setItem("accountstep", String(this.selectedStep));
      this.factory();
    }
  }

  getTabDetails(tabDetails: any) {
    const lastStep = this.selectedStep;
    this.selectedStep = tabDetails.selectedIndex;
    this.currentStep = this.screenList[tabDetails.selectedIndex].screenName;
    sessionStorage.setItem("accountstep", tabDetails.selectedIndex);
    if (lastStep != tabDetails.selectedIndex)
      this.showComponent(this.currentStep);
  }

  onBackOnPreviousStep() {
    this.stepper.previous();
  }

  /**
   * api call for master save in originatin.
   * @param payload
   * @param e
   */
  masterSave(payload, e) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.originationId = resp.data.originationModel.originationId;
        //Note:- properties should be update once complete forumulla list recieves.
        var accountPayload = {
          properties: {},
          screenCode: this.screenList[2].screenCode,
          processStageId: this.processDetails.processStageId,
          processCycleCode: this.processDetails.processCycleCode,
        };

        //Note:- Once workflow formula we will get this should be called.
        // this.workFlowVerify(accountPayload, resp, e);

        //Note:- Once workflow formula we will get this should be comment
        this.done();
      }
    });
  }

  /**
   * api call for workflow api.
   * @param accountPayload
   * @param resp
   * @param e
   */
  workFlowVerify(accountPayload, resp, e) {
    this.loanApi.verifyWorkFlow(accountPayload).subscribe((workres) => {
      if (workres?.autoAction) {
        e.loadingBtnText = LOADING_TEXT;
        e.isLoading = false;
        this.saveCofig(workres);
      } else this.done(resp);
    });
  }

  done(resp?) {
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      data: {
        originationId: this.originationId,
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        this.tokenStore.cleanUpSessionPartially();
        this.router.navigate(["/account/landing"]);
      }
    });
  }

  goBack() {
    const num = this.selectedStep - 1;
    this.currentStep = this.screenList[num].screenName;
    setTimeout(() => {
      this.selectedStep = num;
    }, 200);
  }

  saveCofig(resp) {
    const accountBasisDetails = JSON.parse(
      localStorage.getItem("basisDetails")
    );
    const payload = {
      originationId: this.originationId,
      autoAction: resp?.autoAction,
      approvalConfigId: [parseInt(resp?.approval)],
      basisId: accountBasisDetails?.basisDetailsId,
      processCycleCode: accountBasisDetails?.processCycleCode,
      currentStage: parseInt(sessionStorage.getItem("currentAccountStage")),
      targetStage: parseInt(resp?.targetStage),
      currentScreen: parseInt(resp?.screenCode),
      targetScreen: parseInt(resp?.targetScreen),
    };

    this.loanApi.saveLoanApprovalConfig(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.done();
      } else if (resp?.statusCode === 204) this.done();
    });
  }

  verfyStep(verifyStep, currentStep) {
    if (currentStep?.toLowerCase().includes(verifyStep)) return true;
    else return false;
  }
}
