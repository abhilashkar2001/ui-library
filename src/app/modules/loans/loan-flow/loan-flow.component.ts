import { Component, OnInit, ViewChild } from "@angular/core";
import { Form, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { SessionService } from "app/shared/session.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { LoanFlowConstants } from "./loan-flow.constant";

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

  constructor(
    private loanApi: LoanService,
    private openAccountService: OpenAccountService,
    private snack: MatSnackBar,
    private depositApi: NewDepositService,
    private dialog: MatDialog,
    private router: Router,
    private tokenStore: TokenStorageService
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
    this.getAllLoanStep();
    var sessionStep = sessionStorage.getItem("loanstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
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
        sessionStorage.setItem(
          "currentStage",
          resp.data.processStageList[0].id
        );
        this.openAccountService
          .getProcessStages(resp.data.processStageList[0].id)
          .subscribe((resp) => {
            this.screenList = resp.data.screens.sort((s1, s2) => {
              return s1.sequence - s2.sequence;
            });
            this.updateFormGroup();
            //this.updateStep();
            this.factory();
          });
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
    localStorage.setItem("customerData", JSON.stringify(this.customerData));
    this.next();
  }

  checkExistingUserEvent(event) {
    if (event?.statusCode === 200) {
      sessionStorage.setItem("loanCustomerId", event.data[0].customerId);
      sessionStorage.setItem("isExistingCustomer", "Yes");
      localStorage.setItem("customerData", JSON.stringify(event.data[0]));
      this.next();
    } else if (event?.statusCode === 204) {
      this.screenList = this.originalScreenList;
      this.next();
    }
  }

  onCustomCibilDetail() {
    console.log("onCustomCibilDetail");
    this.next();
  }

  // on Personal details saved
  customSavePersonal(event) {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));

    this.loanApi
      .saveLoanPersonal(event.personalDetails)
      .subscribe((response: any) => {
        if (response?.statusCode === 200) {
          this.customerData = {
            ...this.customerData,
            ...response?.data[0],
          };
          localStorage.setItem(
            "customerData",
            JSON.stringify(this.customerData)
          );
          this.snack.open(`Personal Details Saved` + " !", "OK", {
            duration: 4000,
            verticalPosition: "top",
            horizontalPosition: "right",
          });
          sessionStorage.setItem("loanCustomerId", response.data[0].customerId);
          this.next();
        }
      });
  }
  customSaveDocuments(e) {
    var docIds = [];
    e.documentDetails.otherDocument.forEach((element) => {
      const docId = {
        docIds: element.docIds,
      };
      docIds.push(docId);
    });
    var id = sessionStorage.getItem("loanCustomerId");
    console.log(id);
    var payload = {
      customerId: parseInt(id),
      documentInfo: docIds,
    };
    this.depositApi.submitAllDocument(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        // this.next();
      }
    });
    this.next();
    console.log(docIds);
  }

  // Document section once done
  onConfirm(event) {
    this.next();
  }
  onTCAccepted(event) {
    var id = sessionStorage.getItem("loanCustomerId");

    this.openAccountService.getCustomerById(parseInt(id)).subscribe((resp) => {
      this.saveCustomerInfo(resp);
    });

    //   this.next();
  }

  saveCustomerInfo(resp) {
    const sessionData = JSON.parse(sessionStorage.getItem("loanBasisDetails"));
    const loanData = JSON.parse(sessionStorage.getItem("loanAmmount"));
    var custResp: any = resp.data;
    custResp.forEach((item, i) => {
      custResp[i].documentId = [];
      (custResp[i].jointCustomerInfo = []),
        (custResp[i].isphoneNumVerified = true),
        (custResp[i].isEmailVerified = true),
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
    });

    custResp[0].primaryCustomer = true;

    const payload = {
      originationModel: {
        applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
        accountType: sessionData.basisName,
        basisDetailsId: sessionData.basisId,
        loanAmount: parseInt(loanData.loanAmount),
        loanTenureDay: sessionStorage.getItem("tenureDays"),
        loanTenureMonth: sessionStorage.getItem("tenureMonth"),
        loanTenureYear: sessionStorage.getItem("tenureYear"),
        branchCode: this.tokenStore.getUser().branchCode,
        source: "Website",
      },
      customerInfo: custResp,
    };
    this.openAccountService.saveCustomerInfo(payload).subscribe((resp) => {
      if (resp?.statusCode === 200) {
        this.originationId = resp.data.originationModel.originationId;
        var mapPayload = {
          id: parseInt(sessionStorage.getItem("loanDisburseId")),
          originationId: resp.data.originationModel.originationId,
        };
        // this.verifyWorkFlow();

        this.loanApi.updateOrigination(mapPayload).subscribe((data) => {
          this.loanApi.getLoanSummary(this.originationId).subscribe((resp) => {
            this.loanSummary = resp.data;
            this.next();
          });
        });
      }
    });
  }

  verifyWorkFlow() {
    console.log(this.screenList);
    const loanAmmount = JSON.parse(sessionStorage.getItem("loanAmmount"));
    const loanPayload = {
      loanAmount: loanAmmount.loanAmount,
      estimatedCost: "09876",
      downPayment: null,
      moratariumPeriod: "",
      gender: "",
      nationality: "",
      residenceType: "",
      screenCode: this.screenList[this.selectedStep].screenCode,
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
        sessionStorage.removeItem("loanCustomerId");
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
}
