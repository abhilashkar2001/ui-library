import { Component, ViewChild } from "@angular/core";
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

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private commonService: CommonService,
    private dialog: MatDialog,
    private showSideBar: NewDepositService,
    private loanApi: LoanService,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
    private sharedService: SharedService
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

          this.componentRef.instance?.onCustomSubmit.subscribe((data) => {
            if (data?.personalInfo) {
              this.personalDetails = data.personalInfo;
              this.personalDoc = data.personalInfo[0]?.documentInfo ?? [];
            }
            if (screenName.toLowerCase().includes("personal"))
              this.customSavePersonal(data);
            else if (screenName.toLowerCase().includes("kyc"))
              this.customSaveDocuments(data);
            else this.next();
          });
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
    if (customStageId) {
      this.getCustomerbyStageId(customStageId);
    } else if (this.existingCustomerId) {
      this.getCustomerById(this.existingCustomerId);
    }
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

  cleanCacheInMobileScreen() {
    if (this.currentStep.toLowerCase().includes("mobile")) {
      sessionStorage.removeItem("userCustomerId");
      sessionStorage.removeItem("customerStageId");
      sessionStorage.removeItem("customerId");
    }
  }

  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    sessionStorage.setItem("accountstep", String(this.selectedStep));
    this.factory();
  }

  onVerify(event) {
    this.componentRef.instance.isLoading = true;
    // this.isLoading = true;
    this.openAccountService
      .checkMobileAndProduct(
        this.productDetails.basisName,
        event.phone,
        PRODUCT_DUPLICATION_KEY
      )
      .subscribe((resp) => {
        if (!resp) {
          this.allreadyProduct();
        } else {
          this.openAccountService
            .getExistingCustomer(event.phone)
            .subscribe((resp: any) => {
              // Here cleaning the all ids from cache.
              this.cleanCacheInMobileScreen();
              if (resp?.statusCode === 200 && resp?.data) {
                // if (resp?.data[0]?.onboardingStatus === "APPROVED") {
                if (resp?.data?.length > 0) {
                  console.log("approved record");
                  sessionStorage.setItem("mobileNo", event.phone);
                  sessionStorage.setItem(
                    "userCustomerId",
                    resp.data[0].customerId
                  );

                  this.personalDetails = resp.data;
                  this.componentRef.instance.personalDetails =
                    this.personalDetails;
                  // if (resp.data[0].primaryCustomer)
                  this.personalDoc = resp?.data[0]?.documentInfo;
                  this.componentRef.instance.personalDoc =
                    resp.data[0].documentInfo;
                  this.componentRef.instance.isLoading = false;
                }

                // }
              } else if (resp?.statusCode === 204) {
                this.personalDetails = resp.data;
                this.componentRef.instance.personalDetails =
                  this.personalDetails;
                this.componentRef.instance.isLoading = false;
                sessionStorage.setItem("mobileNo", event.phone);
              } else {
                sessionStorage.setItem("mobileNo", event.phone);
              }
              setTimeout(() => {
                this.next();
              }, 100);
            });
        }
      });
  }
  allreadyProduct() {
    this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage: DUPLICATE_PRODUCT_ERROR_MESSAGE,
        errorMessageHint: DUPLICATE_PRODUCT_HINT,
      },
      width: "650px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
  }

  getTabDetails(tabDetails: any) {
    const lastStep = this.selectedStep;
    this.selectedStep = tabDetails.selectedIndex;
    this.currentStep = this.screenList[tabDetails.selectedIndex].screenName;
    sessionStorage.setItem("accountstep", tabDetails.selectedIndex);
    if (lastStep != tabDetails.selectedIndex)
      this.showComponent(this.currentStep);
  }

  customSavePersonal(event) {
    let payload = event.personalDetails.value.customer;
    if (payload[0]?.prefixValue) delete payload[0].prefixValue;
    payload.forEach((item) => {
      // this customer id also need to set null dynamically.
      item.customerId = null;
      if (!this.existingCustomerId) item.customerNo = null;
      item.primaryCustomer = true;
    });
    this.openAccountService.stageSavePersonalDetails(payload).subscribe(
      (response: any) => {
        sessionStorage.setItem("customerStageId", response.data[0].customerId);
        this.next();
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  onBackOnPreviousStep() {
    this.stepper.previous();
  }

  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    this.openAccountService
      .getCustByStageId(parseInt(sessionStorage.getItem("customerStageId")))
      .subscribe((resp) => {
        const sessionData = JSON.parse(localStorage.getItem("basisDetails"));
        var custResp: any = this.factoryCustomer(resp.data);
        custResp[0].isphoneNumVerified = true;
        custResp[0].isEmailVerified = true;
        custResp[0] = {
          ...custResp[0],
          documentId: docIds[0].docIds?.length > 0 ? docIds : [],
        };
        // custResp[0].customerId = null;
        custResp[0].contact.contactId = null;
        custResp[0].customerNo = null;
        custResp[0].customerId = null;
        custResp[0].contact.address[0].addressId = null;
        delete custResp[0].documentsInfoModel;
        const customerId = sessionStorage.getItem("userCustomerId");
        if (customerId) {
          delete custResp[0].existingCustomerId;
          custResp[0].customerId = parseInt(customerId);
        } else {
          delete custResp[0].existingCustomerId;
          custResp[0].customerId = null;
        }

        const payload = {
          originationModel: {
            applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
            accountType: sessionData.accountType,
            basisDetailsId: sessionData.basisDetailsId,
            branchCode: this.tokenStore.getUser().branchCode,
            source: SOURCE_PAYLOAD_KEY,
            businessProductName: this.productDetails.basisName,
            productDescription: this.productDetails.basisDetailStory,
            ownership: this.ownershipId,
            currencyCode: this.currencyCode?.currency,
            branchId: this.currentUser.branchId,
          },
          customerInfo: custResp,
        };
        this.masterSave(payload, e);
      });
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
        sessionStorage.removeItem("loanBasisDetails");
        sessionStorage.removeItem("customerId");
        sessionStorage.removeItem("loanDisburseId");
        sessionStorage.removeItem("loanstep");
        sessionStorage.removeItem("isExistingCustomer");
        sessionStorage.removeItem("loanAmmount");
        sessionStorage.removeItem("currentAccountStage");
        sessionStorage.removeItem("verifyWork");
        sessionStorage.removeItem("loanHolderType");
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

  factoryCustomer(resp) {
    var custResp = resp;
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      item.documnentsInfo?.documents.forEach((item2, j) =>
        item2?.docs.forEach((item3) => {
          var docId = [];
          docId.push(item3?.documentId);
          var doc = {
            docIds: docId,
          };
          custResp[i].documentId.push(doc);
        })
      );
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
      delete custResp[i].signatureInfo;
    });
    return custResp;
  }
  verfyStep(verifyStep, currentStep) {
    if (currentStep?.toLowerCase().includes(verifyStep)) return true;
    else return false;
  }
}
