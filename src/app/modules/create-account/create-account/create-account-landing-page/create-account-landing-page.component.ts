import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { NewDepositService } from "app/modules/new-deposit/new-deposit.service";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { LoanService } from "app/shared/services/loan/loan.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";

@Component({
  selector: "app-create-account-landing-page",
  templateUrl: "./create-account-landing-page.component.html",
  styleUrls: ["./create-account-landing-page.component.scss"],
})
export class CreateAccountLandingPageComponent {
  accountHeader: string | any;
  stepper: MatStepper;
  screenList: any;
  screenTitle = "Savings Resident Account";
  selectedStep: number = 0;
  currentStep: string;
  originationId: any;

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialog: MatDialog,
    private showSideBar: NewDepositService,
    private loanApi: LoanService,
    private tokenStore: TokenStorageService
  ) {
    this.showSideBar.setToken(true);
    this.accountHeader = this.activeRoute.snapshot["queryParams"]["title"];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {
    var sessionStep = sessionStorage.getItem("accountstep");
    if (sessionStep) this.selectedStep = parseInt(sessionStep);
    const sessionData = JSON.parse(localStorage.getItem("basisDetails"));
    this.openAccountService
      .getProcessCycle(sessionData.processCycleCode)
      .subscribe((resp) => {
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
      });
  }

  factory() {
    this.currentStep = this.screenList[this.selectedStep].screenName;
  }

  next() {
    const num = this.selectedStep + 1;
    this.selectedStep = num;
    sessionStorage.setItem("accountstep", String(this.selectedStep));
    this.factory();
  }

  onVerify() {
    this.next();
  }

  onExit() {
    this.router.navigate(["/"]);
  }

  getTabDetails(tabDetails: any) {
    this.currentStep = this.screenList[tabDetails.selectedIndex].screenName;
    sessionStorage.setItem("accountstep", tabDetails.selectedIndex);
  }

  personalDetailsSubmitted() {
    this.next();
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

    var payload = {
      customerId: parseInt(sessionStorage.getItem("customerId")),
      documentInfo: docIds[0].docIds?.length > 0 ? docIds : [],
    };
    this.openAccountService
      .uploadMultipleDocument(payload)
      .subscribe((resp) => {
        if (resp?.statusCode === 200 || resp?.statusCode === 201) {
          this.openAccountService
            .getCustomerById(resp.data.customerId)
            .subscribe((resp) => {
              const sessionData = JSON.parse(
                localStorage.getItem("basisDetails")
              );
              var custResp = this.factoryCustomer(resp.data);
              custResp[0].primaryCustomer = true;
              custResp[0].isphoneNumVerified = true;
              custResp[0].isEmailVerified = true;
              const payload = {
                originationModel: {
                  applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
                  accountType: sessionData.accountType,
                  basisDetailsId: sessionData.basisDetailsId,
                  branchCode: this.tokenStore.getUser().branchCode,
                  source: "Website",
                },
                customerInfo: custResp,
              };
              this.openAccountService
                .saveCustomerInfo(payload)
                .subscribe((resp) => {
                  if (resp?.statusCode === 200) {
                    this.originationId =
                      resp.data.originationModel.originationId;
                    var accountPayload = {
                      gender: "Male",
                      screenCode: this.screenList[2].screenCode,
                    };
                    this.loanApi
                      .verifyWorkFlow(accountPayload)
                      .subscribe((workres) => {
                        if (workres?.autoAction) this.saveCofig(workres);
                        else this.done(resp);
                      });
                  }
                });
            });
        }
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
        this.router.navigate(["account/applyAccount"]);
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
