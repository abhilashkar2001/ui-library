import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { Form, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { LoanFlowConstants } from "./loan-flow.constant";
import { ErrorNotifierPopupComponent } from "app/shared/components/error-notifier-popup/error-notifier-popup.component";
import { SharedService } from "app/shared/shared.service";
import { AppHostDirective } from "app/shared/directives/app-host.directive";
import { BehaviorSubject } from "rxjs";
import { CusotmWebDocUploadComponent } from "app/shared/components/cusotm-web-doc-upload/cusotm-web-doc-upload.component";

@Component({
  selector: "app-loan-flow",
  templateUrl: "./loan-flow.component.html",
  styleUrls: ["./loan-flow.component.scss"],
})
export class LoanFlowComponent implements OnInit {
  originationValue$: BehaviorSubject<any> = new BehaviorSubject<any>({});
  @ViewChild("loanDocRef") loanDocRef: CusotmWebDocUploadComponent;
  createLoan: FormGroup;
  customVerifyNumber: FormGroup;
  cibilScoreForm: FormGroup;
  documentForm: FormGroup;
  kycDetailsForm: FormGroup;
  customPersonalDetails: FormGroup;
  @ViewChild("stepper") stepper;
  selectedStep: number = 0;
  isLinear = true;
  cuurrentStep: string;
  screenList: any = [];
  screenTitle = "Personal Loan";
  originationId: any;
  loanSummary: any;
  customerData: any;
  customHeader = LoanFlowConstants.CUSTOM_HEADER;
  originalScreenList: any = [];
  createLoanAccountNumber: any;
  customerInfo: any;
  docIds: any[];
  originationModel: any;
  basisId: any;
  productDetails: any;
  processDetails: { processCycleCode: string; processStageId: number };
  personalDetails: any = [];
  staticData = {
    OWNERSHIP: [],
  };
  currentUser: any;
  otherUserInfo: any;
  ownerShipId: any;
  isLoading: boolean = false;
  dynamicScreen = LoanFlowConstants.DYNAMIC_SCREEN;
  @ViewChild("container") container: any;
  @ViewChild(AppHostDirective, { static: true }) appAppHost: AppHostDirective;
  componentRef: any;
  currentComponentInfo: any;
  mobileVerifyInfo = {
    basisName: "",
    productDuplicationKey: "Loan",
    applicationType: "loan application",
  };
  personalDoc: any[] = [];
  loanAccountInfo: any;
  otherLoanDoc: any = null;
  kycDoc: any = null;
  docCustomerDetails: any;
  constructor(
    private loanApi: LoanService,
    private openAccountService: OpenAccountService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    protected cdr: ChangeDetectorRef
  ) {
    // this.depositApi.setToken(true);
  }

  /**
   * creating dynamically view of screen by iterating 'dynamicScreen' json object which match screenName.
   *  & find componentName and load the component.
   * @param screenName current scrrenName.
   */
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
          this.componentRef.instance.basisId = this.basisId;
          this.componentRef.instance.personalDetails = this.personalDetails;
          if (this.docCustomerDetails) {
            this.componentRef.instance.docCustomerDetails =
              this.docCustomerDetails;
          }
          // for personal doc.
          this.componentRef.instance.personalDoc = this.personalDoc;
          this.componentRef.instance.isMasterSave = true;

          this.componentRef.instance.updateParentModel = this.updateAccount;

          this.componentRef.instance?.onCustomSubmit.subscribe((data) => {
            if (data?.value?.accountNumber)
              this.createLoanAccountNumber = data.value.accountNumber;

            if (data?.personalInfo) {
              this.personalDetails = data.personalInfo;
              this.personalDetails.forEach((item) => {
                if (item.primaryCustomer) this.personalDoc = item?.documentInfo;
              });
            }

            if (screenName.toLowerCase().includes("personal")) {
              this.customSavePersonal(data);
            }
          });
          this.componentRef.instance?.onBackEvent.subscribe((_) => {
            this.goBack();
          });
        });
      }
    });
  }

  /**
   * it will check the updateMasterSave key if its true it will call master-save or else it will move to next screen.
   * @param value inputValue of child screen
   */
  updateAccount = (value: Partial<any>) => {
    const isLoan = value?.isForLoan ?? true;
    if (value?.otherLoanDoc) this.otherLoanDoc = value?.otherLoanDoc;
    if (value.kycDoc) {
      this.kycDoc = value.kycDoc;
      this.docCustomerDetails = value.customerDetails;
    }
    let originationModel = {
      ...this.factorizedPayload(),
    };
    let customerInfo = this.modelFactoryForCustomer(
      this.personalDetails,
      value?.kycDoc ?? null
    );
    if (value.updateMasterSave && isLoan && this.personalDetails?.length > 0) {
      this.getMasterSave({
        originationModel: originationModel,
        customerInfo: customerInfo,
      });
    } else {
      if (!isLoan) return;
      else this.next();
    }
  };

  ngOnInit(): void {
    this.currentUser = this.tokenStore.getUser();
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.basisId = this.route.snapshot.params["id"];
    this.getAllLoanStep();
    this.getProductDetails();
    var sessionStep = sessionStorage.getItem("loanstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    var originationId = sessionStorage.getItem("originationId");
    var customerId = JSON.parse(sessionStorage.getItem("userCustomerId"));
    var customerStageId = JSON.parse(
      sessionStorage.getItem("customerStageIds")
    );
    if (originationId) this.getOriginationMaster(parseInt(originationId));
    else if (customerStageId) {
      this.getCustByStageId(customerStageId);
    } else if (customerId) {
      this.getCustomerById(customerId);
    }
  }

  getCustomerById(customerId) {
    setTimeout(() => {
      this.fetchCustomersbyId().then((resp) => {
        this.personalDetails = resp;
        // this.componentRef.instance.personalDetails = this.personalDetails;
      });
    }, 500);
  }

  getCustByStageId(customerStageId) {
    setTimeout(() => {
      this.fetchCustomers().then((resp) => {
        this.personalDetails = resp;
      });
    }, 500);
  }

  /**
   * api call for getting product details by basisId
   */
  getProductDetails() {
    this.loanApi.getProductDetails(this.basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.productDetails = resp.data[0];
        this.mobileVerifyInfo = {
          ...this.mobileVerifyInfo,
          basisName: this.productDetails.basisName,
        };
      }
    });
  }

  getOriginationMaster(id) {
    this.loanApi.getOriginationMaster(parseInt(id)).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.customerInfo = resp.data[0]?.customerInfo;
        this.personalDetails = resp.data[0]?.customerInfo;
        this.originationId = resp.data[0].originationModel.originationId;
        this.originationModel = resp.data[0]?.originationModel;
        this.componentRef.instance.personalDetails = this.personalDetails;
        this.cdr.detectChanges();
      }
      console.log(this.customerInfo);
    });
  }

  getAllLoanStep() {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    this.openAccountService
      .getProcessCycle(sessionData.processCycleCode)
      .subscribe((resp) => {
        this.processDetails = {
          processCycleCode: resp.data.processCycleCode,
          processStageId: resp.data.processStageList[0]?.id,
        };
        sessionStorage.setItem(
          "currentStage",
          resp.data.processStageList[0].id
        );
        this.getProcessStages(resp.data.processStageList[0].id);
      });
  }

  getProcessStages(id) {
    this.openAccountService.getProcessStages(id).subscribe((resp) => {
      this.screenList = resp.data.screens.sort((s1, s2) => {
        return s1.sequence - s2.sequence;
      });
      this.factory();
    });
  }

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
    });

    return custResp;
  }

  /**
   *
   * @returns a payload object for the orgination model.
   */
  factorizedPayload() {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    const ownershipId = JSON.parse(sessionStorage.getItem("ownershipId"));
    if (loanData) {
      let payload = {
        originationId: this.originationModel?.originationId ?? null,
        applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
        accountType: sessionData.basisName,
        basisDetailsId: sessionData.basisId,
        loanAmount: parseInt(loanData.loanAmount),
        loanTenureDay: sessionStorage.getItem("tenureDays"),
        loanTenureMonth: sessionStorage.getItem("tenureMonth"),
        loanTenureYear: sessionStorage.getItem("tenureYear"),
        branchCode: this.tokenStore.getUser().branchCode,
        source: "Website",
        businessProductName: this.productDetails.basisName,
        productDescription: this.productDetails.basisDetailStory,
        currencyCode: this.otherUserInfo.currency,
        branchId: this.currentUser.branchId,
        ownership: ownershipId,
        documentId: this.otherLoanDoc?.length > 0 ? this.otherLoanDoc : null,
      };
      return payload;
    } else return;
  }

  stepperSelectionChange(event) {
    const lastStep = this.selectedStep;
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    sessionStorage.setItem("loanstep", event.selectedIndex);
    this.selectedStep = event.selectedIndex;
    if (lastStep != event.selectedIndex) this.showComponent(this.cuurrentStep);
  }
  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep]?.screenName;
    this.showComponent(this.cuurrentStep);
  }
  next() {
    const num = this.selectedStep + 1;
    if (num === this.screenList?.length && num > 0) {
      this.onFlowDone();
      return;
    } else {
      this.selectedStep = num;
      sessionStorage.setItem("loanstep", String(this.selectedStep));
      sessionStorage.setItem(
        "currentScreenCode",
        this.screenList[num].screenCode
      );
      this.factory();
      // for scrolling sidebar and get current state.
      const el = document.querySelector(".mat-step-label-selected");
      el.scrollIntoView();
    }
  }

  getCustInfoPayload(event, prefixValue) {
    return new Promise((resolve, reject) => {
      var customer = [];
      event.forEach((element, i) => {
        // if (element.primaryCustomer) {
        sessionStorage.setItem(
          "customerData",
          JSON.stringify({
            name: `${prefixValue}. ${element.firstName} ${element.lastName}`,
            cifNumber:
              element.kycStatus === "APPROVED" ? element.customerId : "",
          })
        );
        // }
        console.log(element);
        var docIds = [];
        if (element?.documentId) {
          docIds.push(element.documentId);
        } else {
          element?.documnentsInfo?.documents.forEach((item) => {
            let docItemId = [];
            item.docs.forEach((docItem) => {
              docItemId.push(docItem.documentId);
            });
            const docId = {
              docIds: docItemId,
            };
            docIds.push(docId);
          });
        }
        const cus = {
          ...element,
          jointCustomerInfo: [],
          middleName: "",
          dateOfBirth: moment(element.dateOfBirth).format(),
          documentId: element.primaryCustomer
            ? this.kycDoc
              ? this.kycDoc
              : docIds
            : [],
        };
        customer.push(cus);
      });
      resolve(customer);
    });
  }

  getOriginationModelForLoan() {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    const ownershipId = JSON.parse(sessionStorage.getItem("ownershipId"));
    return {
      originationId: this.originationModel?.originationId ?? null,
      applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
      accountType: sessionData.basisName,
      basisDetailsId: sessionData.basisId,
      loanAmount: parseInt(loanData.loanAmount),
      loanTenureDay: sessionStorage.getItem("tenureDays"),
      loanTenureMonth: sessionStorage.getItem("tenureMonth"),
      loanTenureYear: sessionStorage.getItem("tenureYear"),
      branchCode: this.tokenStore.getUser().branchCode,
      source: "Website",
      businessProductName: null,
      productDescription: null,
      currencyCode: this.otherUserInfo.currency,
      branchId: this.currentUser.branchId,
      ownership: ownershipId,
      documentId: this.otherLoanDoc ?? null,
    };
  }

  // on Personal details saved
  customSavePersonal(event) {
    console.log(event);
    const payload = event.personalDetails.value.customer;
    payload.forEach((item) => {
      delete item.prefixValue;
      item.customerId = null;
    });
    // if (payload[0]?.prefixValue) delete payload[0].prefixValue;
    this.getCustInfoPayload(
      event.personalDetails.value.customer,
      event.prefixValue
    ).then((data) => {
      const payloadData = {
        originationModel: { ...this.factorizedPayload() },
        customerInfo: data,
      };
      this.openAccountService
        .saveCustomerInfo(payloadData)
        .subscribe((resp) => {
          if (resp?.statusCode === 200) {
            this.originationModel = resp.data?.originationModel;
            this.personalDetails = resp.data?.customerInfo;
            this.loanAccountInfo = resp.data?.loanAccountInfo;
            this.originationValue$ = resp.data;
            let customId = [];
            resp.data?.customerInfo?.forEach((item, i) => {
              customId.push(item.customerId);
            });
            this.snack.open(`Personal Details Saved` + " !", "OK", {
              duration: 4000,
              verticalPosition: "top",
              horizontalPosition: "right",
              panelClass: "snackbar-error",
            });
            sessionStorage.setItem(
              "customerStageIds",
              JSON.stringify(customId)
            );
            this.customerInfo = resp.data?.customerInfo;
            sessionStorage.setItem(
              "originationId",
              resp?.data?.originationModel?.originationId
            );
            sessionStorage.removeItem("loanDoc");
            this.updateWebDisbursment();
          }
        });
    });
  }

  updateWebDisbursment() {
    const originationId = sessionStorage.getItem("originationId");
    var mapPayload = {
      id: parseInt(sessionStorage.getItem("loanDisburseId")),
      originationId: parseInt(originationId),
    };

    this.loanApi.updateOrigination(mapPayload).subscribe((data) => {
      this.next();
    });
  }

  fetchCustomersbyId() {
    const customIds = JSON.parse(sessionStorage.getItem("userCustomerId"));
    return new Promise((resolve, reject) => {
      const promises = customIds.map((id) => {
        return new Promise((innerResolve, innerReject) => {
          this.openAccountService.getCustomerById(id).subscribe((resp) => {
            if (resp?.statusCode === 200)
              innerResolve({
                ...resp.data[0],
                customerId: null,
                customerNo: null,
                contact: {
                  ...resp.data[0].contact,
                  contactId: null,
                  address: [
                    { ...resp.data[0].contact.address[0], addressId: null },
                  ],
                },
              });
            else innerResolve(null); // or handle rejection if needed
          });
        });
      });
      Promise.all(promises).then((customers) => {
        const filteredCustomers = customers.filter(
          (customer) => customer !== null
        );
        resolve(filteredCustomers);
      });
    });
  }

  fetchCustomers() {
    const customIds = JSON.parse(sessionStorage.getItem("customerStageIds"));
    return new Promise((resolve, reject) => {
      const promises = customIds.map((id) => {
        return new Promise((innerResolve, innerReject) => {
          this.loanApi.getCustByStageId(id).subscribe((resp) => {
            if (resp?.statusCode === 200)
              innerResolve({
                ...resp.data[0],
                customerId: null,
                customerNo: null,
                contact: {
                  ...resp.data[0].contact,
                  contactId: null,
                  address: [
                    { ...resp.data[0].contact.address[0], addressId: null },
                  ],
                },
              });
            else innerResolve(null); // or handle rejection if needed
          });
        });
      });
      Promise.all(promises).then((customers) => {
        const filteredCustomers = customers.filter(
          (customer) => customer !== null
        );
        resolve(filteredCustomers);
      });
    });
  }

  saveCustomerInfo(resp, docIds) {
    var custResp: any = [...resp];
    let customerDetails = this.modelFactoryForCustomer(custResp, docIds);
    const existingCustomerId = JSON.parse(
      sessionStorage.getItem("userCustomerId")
    );
    if (existingCustomerId) {
      customerDetails.forEach((item, i) => {
        if (i >= existingCustomerId.length) {
          delete customerDetails[i].existingCustomerId;
          customerDetails[i].customerId = null;
        } else {
          delete customerDetails[i].existingCustomerId;
          customerDetails[i].customerId = existingCustomerId[i];
        }
      });
    }
    const payload = {
      originationModel: this.factorizedPayload(),
      customerInfo: customerDetails,
    };
    console.log(payload, ".......");
    this.getMasterSave(payload);
  }

  getMasterSave(payload) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode == 200 && resp?.data) {
        sessionStorage.setItem(
          "originationId",
          resp?.data?.originationModel?.originationId
        );
        this.next();
      }
    });
  }

  //once all workflow formula we will get it will call on summary save api
  verifyWorkFlow() {
    console.log(this.screenList);
    const loanAmmount = JSON.parse(sessionStorage.getItem("loanAmmount"));

    const properties = {
      loanAmount: loanAmmount.loanAmount,
      estimatedCost: "09876",
      downPayment: null,
      moratariumPeriod: "",
      gender: "",
      nationality: "",
      residenceType: "",
      screenCode: this.screenList[this.selectedStep].screenCode,
    };
    const loanPayload = {
      properties: properties,
      screenCode: this.screenList[2].screenCode,
      processStageId: this.processDetails.processStageId,
      processCycleCode: this.processDetails.processCycleCode,
    };
    this.loanApi.verifyWorkFlow(loanPayload).subscribe((resp) => {
      if (resp?.autoAction) this.saveApprovalConfig(resp);
      else this.onFlowDone();
    });
    this.onFlowDone();
  }

  saveApprovalConfig(resp) {
    const loanBasisDetails = JSON.parse(
      sessionStorage.getItem("loanBasisDetails")
    );
    const payload = {
      originationId: this.originationId,
      autoAction: resp?.autoAction,
      approvalConfigId: [parseInt(resp?.approval)],
      basisId: loanBasisDetails?.basisId,
      processCycleCode: loanBasisDetails?.processCycleCode,
      currentStage: parseInt(sessionStorage.getItem("currentStage")),
      targetStage: parseInt(resp?.targetStage),
      currentScreen: parseInt(resp?.screenCode),
      targetScreen: parseInt(resp?.targetScreen),
    };
    this.loanApi.saveLoanApprovalConfig(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.onFlowDone();
      } else if (resp?.statusCode === 204) this.onFlowDone();
    });
  }

  onFlowDone() {
    const originationId = sessionStorage.getItem("originationId");
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      data: {
        originationId: originationId,
        loanSummary: this.loanSummary,
        customHeader: this.customHeader,
        type: "loan",
      },
      width: "750px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        this.tokenStore.cleanUpSessionPartially();
        this.router.navigate(["loan/landing"]);
      }
    });
  }
  goBack() {
    const num = this.selectedStep - 1;
    this.cuurrentStep = this.screenList[num].screenName;
    setTimeout(() => {
      this.selectedStep = num;
      this.factory();
    }, 200);
  }

  verfyStep(verifyStep, currentStep) {
    if (currentStep?.toLowerCase().includes(verifyStep)) return true;
    else return false;
  }

  getOwnershipIdByGeneric(value) {
    let ownership = [];
    this.sharedService
      .genericValue("Common", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          ownership = resp.data["OWNERSHIP"];
          this.ownerShipId = ownership.find(
            (r) => r?.values?.toLowerCase() === value?.toLowerCase()
          )?.id;
        }
      });
  }

  checkBtnValidity() {
    return this.cuurrentStep?.toLowerCase().includes("loan document");
  }

  addDoc() {
    this.loanDocRef.addDocument();
  }
}
