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
import { SharedService } from "app/shared/shared.service";

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
  personalDetails: any = [];
  staticData = {
    OWNERSHIP: [],
  };
  currentUser: any;
  otherUserInfo: any;
  ownerShipId: any;
  isLoading: boolean = false;
  constructor(
    private loanApi: LoanService,
    private openAccountService: OpenAccountService,
    private snack: MatSnackBar,
    private depositApi: NewDepositService,
    private dialog: MatDialog,
    private router: Router,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
    private sharedService: SharedService
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
    this.currentUser = this.tokenStore.getUser();
    this.otherUserInfo = this.tokenStore.getUserOtherInfo();
    this.basisId = this.route.snapshot.params["id"];
    this.getAllLoanStep();
    this.getProductDetails();
    var sessionStep = sessionStorage.getItem("loanstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    this.getOwnershipIdByGeneric(sessionStorage.getItem("loanHolderType"));
    console.log(this.ownerShipId);
    var originationId = sessionStorage.getItem("originationId");
    var customerId = JSON.parse(sessionStorage.getItem("customerIds"));
    var customerStageId = JSON.parse(
      sessionStorage.getItem("customerStageIds")
    );
    if (originationId) this.getOriginationMaster(parseInt(originationId));
    else if (customerId) {
      this.getCustomerById(customerId);
    } else if (customerStageId) {
      this.getCustByStageId(customerStageId);
    }
  }

  getCustomerById(customerId) {
    customerId.forEach((element) => {
      this.openAccountService.getCustomerById(element).subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data;
        }
      });
    });
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
    this.getOwnershipIdByGeneric(sessionStorage.getItem("loanHolderType"));
    console.log(this.ownerShipId);
  }

  checkExistingUserEvent(event) {
    let customerIds: any[] = [];
    this.isLoading = true;
    this.loanApi
      .getExistingUserDetails(event.phone)
      .subscribe((response: any) => {
        console.log("Existing user: ", response);
        if (response.statusCode == 200 && response.data) {
          response.data.forEach((element) => {
            customerIds.push(element.customerId);
          });
          sessionStorage.setItem("customerIds", JSON.stringify(customerIds));
          // let temp = response.data[0];
          this.personalDetails = response.data;
          // this.personalDetails.push(temp);
        }
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
              "existingCustomerId",
              event.response.data[0].customerId
            );
            sessionStorage.setItem("isExistingCustomer", "Yes");
            localStorage.setItem(
              "customerData",
              JSON.stringify(event.response.data[0])
            );
            this.isLoading = false;
            this.next();
          } else if (event.response?.statusCode === 204) {
            this.isLoading = false;
            this.next();
          } else {
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
          documentId: element.primaryCustomer ? docIds : [],
        };
        customer.push(cus);
      });
      resolve(customer);
    });
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
      this.loanApi.stageSavePersonalDetails(data).subscribe((resp) => {
        if (resp?.statusCode === 200) {
          this.personalDetails = resp.data;
          let customId = [];
          resp.data?.forEach((item, i) => {
            customId.push(item.customerId);
          });
          this.snack.open(`Personal Details Saved` + " !", "OK", {
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "right",
            panelClass: "snackbar-error",
          });
          sessionStorage.setItem("customerStageIds", JSON.stringify(customId));
          this.customerInfo = resp.data;
          this.next();
        }
      });
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
        //  middleName: "",
        gender: element.gender,
        // jointCustomerInfo: [],
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
    this.fetchCustomers().then((resp) => {
      this.saveCustomerInfo(resp, docIds);
    });

    // this.loanApi
    //   .getCustByStageId(parseInt(sessionStorage.getItem("customerId")))
    //   .subscribe((resp) => {
    //     if (resp?.statusCode === 200) this.saveCustomerInfo(resp.data, docIds);
    //   });
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
    // sessionStorage.getItem("customerId");
    var custResp: any = [...resp];
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      custResp[0].primaryCustomer = true; //Need to remove lator while multiple customer
      if (item.primaryCustomer === true) custResp[i].documentId = docIds;
      delete custResp[i].biometricInfo;
      delete custResp[i].documnentsInfo;
      delete custResp[i].documentsInfoModel;
      delete custResp[i].signatureInfo;
    });
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    const payload = {
      originationModel: {
        ...this.getOriginationModel(),
        businessProductName: this.productDetails.basisName,
        productDescription: this.productDetails.basisDetailStory,
        currencyCode: this.otherUserInfo.currency,
        branchId: this.currentUser.branchId,
        ownership: this.ownerShipId,
        documentId: JSON.parse(sessionStorage.getItem("loanDoc")),
        applicationDate: moment(new Date()).format("DD-MMM-YYYY"),
        accountType: this.originationModel?.accountType,
        basisDetailsId: sessionData.basisId,
        loanAmount: parseInt(loanData.loanAmount),
        loanTenureDay: sessionStorage.getItem("tenureDays"),
        loanTenureMonth: sessionStorage.getItem("tenureMonth"),
        loanTenureYear: sessionStorage.getItem("tenureYear"),
        branchCode: this.originationModel?.branchCode,
        source: "Website",
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
    event.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });

    sessionStorage.setItem("loanDoc", JSON.stringify(docIds));
    this.next();
  }

  getMasterSave(payload) {
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode == 200 && resp?.data) {
        sessionStorage.setItem(
          "originationId",
          resp?.data?.originationModel?.originationId
        );
        sessionStorage.removeItem("loanDoc");
        this.next();
      }
    });
  }

  /**
   * api call to update Origination.
   */
  onTCAccepted(event) {
    const originationId = sessionStorage.getItem("originationId");
    var mapPayload = {
      id: parseInt(sessionStorage.getItem("loanDisburseId")),
      originationId: parseInt(originationId),
    };

    this.loanApi.updateOrigination(mapPayload).subscribe((data) => {
      this.loanApi.getLoanSummary(originationId).subscribe((resp) => {
        this.loanSummary = resp.data;
        this.next();
      });
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
        sessionStorage.removeItem("customerStageIds");
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

  getOwnershipIdByGeneric(value) {
    let ownership;
    this.sharedService
      .genericValue("Common", Object.keys(this.staticData))
      .subscribe((resp: any) => {
        if (resp?.statusCode === 200) {
          ownership = resp.data["OWNERSHIP"];
          this.ownerShipId = ownership.find(
            (r) => r?.values.toLowerCase() === value.toLowerCase()
          )?.id;
        }
      });
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
    };
  }
}
