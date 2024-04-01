import { Component, OnInit, ViewChild } from "@angular/core";
import { Form, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SessionService } from "app/shared/session.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { LoanFlowConstants } from "./loan-flow.constant";
import { ErrorNotifierPopupComponent } from "app/shared/components/error-notifier-popup/error-notifier-popup.component";

@Component({
  selector: "app-loan-flow",
  templateUrl: "./loan-flow.component.html",
  styleUrls: ["./loan-flow.component.scss"],
})
export class LoanFlowComponent implements OnInit {
  createLoan: FormGroup;
  customVerifyNumber: FormGroup;
  cibilScoreForm: FormGroup;
  documentForm: FormGroup;
  kycDetailsForm: FormGroup;
  customPersonalDetails: FormGroup;
  steper_Array: any;
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
  personalDetails: any;

  constructor(
    private loanApi: LoanService,
    private openAccountService: OpenAccountService,
    private snack: MatSnackBar,
    private depositApi: NewDepositService,
    private dialog: MatDialog,
    private router: Router,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.steper_Array = [
      {
        id: 1,
        stepFormControl: this.createLoan,
        label: "Create Loan",
        key: "create",
      },
      {
        id: 2,
        stepFormControl: this.customVerifyNumber,
        label: "Verify Mobile Number",
        key: "mobile",
      },
      {
        id: 3,
        stepFormControl: this.cibilScoreForm,
        label: "CIBIL Score",
        key: "cibil",
      },
      {
        id: 4,
        stepFormControl: this.customPersonalDetails,
        label: "Personal Details",
        key: "personal",
      },
      {
        id: 5,
        stepFormControl: this.kycDetailsForm,
        label: "Select KYC",
        key: "kyc",
      },
      {
        id: 6,
        stepFormControl: this.documentForm,
        label: "Document",
        key: "document",
      },

      {
        id: 7,
        //stepFormControl,
        label: "terms",
        key: "terms",
      },
      {
        id: 8,
        //stepFormControl: this.kycDetailsForm,
        label: "summary",
        key: "summary",
      },
    ];
    this.depositApi.setToken(true);
  }

  ngOnInit(): void {
    this.basisId = this.route.snapshot.params["id"];
    this.getAllLoanStep();
    this.getProductDetails();
    var sessionStep = sessionStorage.getItem("loanstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    var originationId = sessionStorage.getItem("originationId");
    if (originationId) this.getOriginationMaster(parseInt(originationId));
  }

  /**
   * api call for getting product details by basisId
   */
  getProductDetails() {
    this.loanApi.getProductDetails(this.basisId).subscribe((resp) => {
      if (resp?.statusCode === 200) this.productDetails = resp.data[0];
    });
  }

  getOriginationMaster(id) {
    this.loanApi.getOriginationMaster(parseInt(id)).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.customerInfo = resp.data[0]?.customerInfo;
        this.personalDetails = resp.data[0]?.customerInfo;
        this.originationId = resp.data[0].originationModel.originationId;
        this.originationModel = resp.data[0]?.originationModel;
      }
      console.log(this.customerInfo);
    });
  }

  updateStep() {
    var isExistingCustomer = sessionStorage.getItem("isExistingCustomer");
    this.originalScreenList = this.screenList;
    console.log(this.screenList);
    if (isExistingCustomer) {
      var pk = this.screenList;
      var jk = pk.filter((item) => {
        if (
          !item.screenName.toLowerCase().includes("personal") &&
          !item.screenName.toLowerCase().includes("select")
        ) {
          return item;
        }
      });
      const customStepArr = this.steper_Array?.filter((item) => {
        if (
          !item.label.toLowerCase().includes("personal") &&
          !item.label.toLowerCase().includes("select")
        ) {
          return item;
        }
      });
      this.steper_Array = customStepArr;
      this.screenList = jk;
      console.log(this.screenList, this.steper_Array);
    }
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
      this.updateFormGroup();
      //this.updateStep();
      this.factory();
    });
  }
  updateFormGroup() {
    this.steper_Array.forEach((item, i) => {
      this.screenList.map((element, j) => {
        if (element.screenName.toLowerCase().includes(item.key)) {
          this.screenList[j].stepFormControl = item?.stepFormControl;
        }
      });
    });
  }
  stepperSelectionChange(event) {
    this.cuurrentStep = this.screenList[event.selectedIndex].screenName;
    sessionStorage.setItem("loanstep", event.selectedIndex);
    this.selectedStep = event.selectedIndex;
  }
  factory() {
    this.cuurrentStep = this.screenList[this.selectedStep]?.screenName;
  }
  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    sessionStorage.setItem("loanstep", String(this.selectedStep));
    this.factory();
    // for scrolling sidebar and get current state.
    const el = document.querySelector(".mat-step-label-selected");
    el.scrollIntoView();
  }

  onSaveCreateLoan(event) {
    this.createLoanAccountNumber = event.value.accountNumber;
    localStorage.setItem("customerData", JSON.stringify(this.customerData));
    this.next();
  }

  checkExistingUserEvent(event) {
    this.loanApi
      .getExistingUserDetails(event.phone)
      .subscribe((response: any) => {
        console.log("Existing user: ", response);
        this.checkProducts(event);
      });
  }

  checkProducts(event) {
    this.loanApi
      .checkMobileAndProduct(this.productDetails.basisName, event.phone, "Loan")
      .subscribe((resp) => {
        if (!resp) {
          this.allreadyProduct();
        } else {
          if (event.response?.statusCode === 200) {
            sessionStorage.setItem(
              "customerId",
              event.response.data[0].customerId
            );
            sessionStorage.setItem("isExistingCustomer", "Yes");
            localStorage.setItem(
              "customerData",
              JSON.stringify(event.response.data[0])
            );
            this.next();
          } else if (event.response?.statusCode === 204) {
            this.next();
          }
        }
      });
  }

  allreadyProduct() {
    this.dialog.open(ErrorNotifierPopupComponent, {
      data: {
        errorMessage:
          "We have found similar loan application in our record on your Mobile Number",
        errorMessageHint: "Please visit bank for more information.",
      },
      width: "650px",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
  }

  onCustomCibilDetail() {
    console.log("onCustomCibilDetail");
    this.next();
  }

  // on Personal details saved
  customSavePersonal(event) {
    const customer = this.createPayload(event.personalDetails.value.customer);
    customer[0].contact.mobile = sessionStorage.getItem("loanPhone");
    if (event.personalDetails.value.customer[0].kycStatus)
      customer[0].kycStatus = event.personalDetails.value.customer[0].kycStatus;
    const payload = {
      originationModel: {
        ...this.getOriginationModel(),
        businessProductName: this.productDetails.basisName,
        productDescription: this.productDetails.basisDetailStory,
      },
      customerInfo: customer,
    };
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.personalDetails = resp.data?.customerInfo;
        sessionStorage.setItem(
          "originationId",
          resp.data.originationModel.originationId
        );
        this.originationId = resp.data.originationModel.originationId;
        resp.data?.customerInfo?.forEach((item, i) => {
          if (item.primaryCustomer)
            sessionStorage.setItem("customerId", item.customerId);
        });
        this.snack.open(`Personal Details Saved` + " !", "OK", {
          duration: 4000,
          verticalPosition: "top",
          horizontalPosition: "right",
          panelClass: "snackbar-error",
        });
        this.originationModel = resp.data?.originationModel;
        this.customerInfo = resp.data?.customerInfo;
        this.next();
      }
    });
  }

  createPayload(event) {
    var customer = [];
    event.forEach((element, i) => {
      if (element.primaryCustomer) {
        sessionStorage.setItem(
          "customerData",
          JSON.stringify({
            name: `${element.prefix}. ${element.firstName} ${element.lastName}`,
            cifNumber:
              element.kycStatus === "APPROVED" ? element.customerId : "",
          })
        );
      }
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
        prefix: element.prefix,
        firstName: element.firstName,
        lastName: element.lastName,
        customerId: element?.customerId,
        middleName: "",
        gender: element.gender,
        jointCustomerInfo: [],
        documentId: element.primaryCustomer ? docIds : [],
        isphoneNumVerified: true,
        isEmailVerified: true,
        primaryCustomer: element.primaryCustomer ?? false,
        source: element.source,
        dateOfBirth: moment(element.dateOfBirth).format(),
        nationality: element.nationality,
        contact: {
          mobile: element.mobile,
          email: element.email,
          address: [
            {
              address1:
                element?.contact?.address[0].address1 ?? element.address1,
              address2: "",
              residenceType:
                element?.contact?.address[0].residenceType ??
                element.residenceType,
              cityId: element?.contact?.address[0].cityId ?? element.cityId,
              countryName:
                element?.contact?.address[0].countryName ?? element.country,
              pincode: element?.contact?.address[0].pincode ?? element.zipCode,
              stateName:
                element?.contact?.address[0].stateName ?? element.state,
            },
          ],
        },
      };
      customer.push(cus);
    });

    return customer;
  }

  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });
    this.docIds = docIds;
    this.saveCustomerInfo(this.customerInfo, docIds);
  }

  saveCustomerInfo(resp, docIds) {
    var custResp: any = [...resp];
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
    });
    const payload = {
      originationModel: {
        ...this.getOriginationModel(),
        businessProductName: this.productDetails.basisName,
        productDescription: this.productDetails.basisDetailStory,
      },
      customerInfo: custResp,
    };
    this.getMasterSave(payload);
  }

  /**
   * Here creating payload and calling getMasterSave method and move to next screen.
   * @param event is getting all uploaded document info.
   */
  onConfirm(event) {
    var docIds = [];
    event.forEach((element) => {
      let docItemId = [];
      element.fileInfo.forEach((documents: any) => {
        docItemId.push(documents.docId ?? documents.id);
      });
      const docId = {
        docIds: docItemId,
      };
      docIds.push(docId);
    });
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    const customer = this.createPayload(this.customerInfo);
    const payload = {
      originationModel: {
        applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
        accountType: this.originationModel?.accountType,
        basisDetailsId: sessionData.basisId,
        loanAmount: parseInt(loanData.loanAmount),
        loanTenureDay: sessionStorage.getItem("tenureDays"),
        loanTenureMonth: sessionStorage.getItem("tenureMonth"),
        loanTenureYear: sessionStorage.getItem("tenureYear"),
        branchCode: this.originationModel?.branchCode,
        source: "Website",
        ownership: sessionStorage.getItem("loanHolderType"),
        documentId: docIds,
        originationId: this.originationModel?.originationId,
        businessProductName: this.productDetails.basisName,
        productDescription: this.productDetails.basisDetailStory,
      },
      customerInfo: customer,
    };
    payload.customerInfo.forEach((cust) => {
      cust.documentId = docIds;
    });
    this.getMasterSave(payload);
  }

  getMasterSave(payload) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      this.next();
    });
  }

  /**
   * api call to update Origination.
   */
  onTCAccepted(event) {
    var customerId = this.customerInfo.filter(
      (item) => item?.primaryCustomer
    )[0]?.customerId;
    var mapPayload = {
      id: parseInt(sessionStorage.getItem("loanDisburseId")),
      originationId: this.originationId,
      customerId: customerId,
    };
    this.loanApi.updateOrigination(mapPayload).subscribe((data) => {
      this.loanApi.getLoanSummary(this.originationId).subscribe((resp) => {
        this.loanSummary = resp.data;
        this.next();
      });
    });
  }

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
    const dialogRef = this.dialog.open(SuccessPopupComponent, {
      data: {
        originationId: this.originationId,
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
        sessionStorage.removeItem("loanBasisDetails");
        sessionStorage.removeItem("customerId");
        sessionStorage.removeItem("loanDisburseId");
        sessionStorage.removeItem("loanstep");
        sessionStorage.removeItem("isExistingCustomer");
        sessionStorage.removeItem("loanAmmount");
        sessionStorage.removeItem("currentStage");
        sessionStorage.removeItem("verifyWork");
        sessionStorage.removeItem("loanHolderType");
        sessionStorage.removeItem("tenureDays");
        sessionStorage.removeItem("tenureMonth");
        sessionStorage.removeItem("tenureYear");
        sessionStorage.removeItem("customerId");
        sessionStorage.removeItem("loanBasisDetails");
        sessionStorage.removeItem("loanDisburseId");
        this.router.navigate(["loan/landing"]);
      }
    });
  }
  goBack() {
    const num = this.selectedStep - 1;
    this.cuurrentStep = this.screenList[num].screenName;
    setTimeout(() => {
      this.selectedStep = num;
    }, 200);
  }

  verfyStep(verifyStep, currentStep) {
    if (currentStep?.toLowerCase().includes(verifyStep)) return true;
    else return false;
  }

  getOriginationModel() {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    return {
      applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
      accountType: sessionData.basisName,
      basisDetailsId: sessionData.basisId,
      loanAmount: parseInt(loanData.loanAmount),
      loanTenureDay: sessionStorage.getItem("tenureDays"),
      loanTenureMonth: sessionStorage.getItem("tenureMonth"),
      loanTenureYear: sessionStorage.getItem("tenureYear"),
      branchCode: this.tokenStore.getUser().branchCode,
      source: "Website",
      ownership: sessionStorage.getItem("loanHolderType"),
    };
  }
}
