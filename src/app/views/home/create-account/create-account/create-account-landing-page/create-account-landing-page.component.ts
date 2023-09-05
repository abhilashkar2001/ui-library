import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatStepper } from "@angular/material/stepper";
import { ActivatedRoute, Router } from "@angular/router";
import { SuccessPopupComponent } from "app/shared/components/success-popup/success-popup.component";
import { CommonService } from "app/shared/services/common-service/common.service";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import * as moment from "moment";

@Component({
  selector: "app-create-account-landing-page",
  templateUrl: "./create-account-landing-page.component.html",
  styleUrls: ["./create-account-landing-page.component.scss"],
})
export class CreateAccountLandingPageComponent {
  selectedPhoneCode: string = "+91";
  displaySecond: any;
  showOTPSection: boolean;
  phone: any;
  otp: any;
  resendLink: boolean = false;
  otpDigit1: string = "";
  otpDigit2: string = "";
  otpDigit3: string = "";
  otpDigit4: string = "";
  otpDigit5: string = "";
  otpDigit6: string = "";
  agreed: boolean = false;
  accountHeader: string | any;
  isMobileVerificationTab: boolean = true;
  isPersonalDetailsTab: boolean;
  isSelectKYCTab: boolean;
  stepper: MatStepper;
  screenList: any;

  constructor(
    private router: Router,
    private openAccountService: OpenAccountService,
    private activeRoute: ActivatedRoute,
    private commonService: CommonService,
    private dialog: MatDialog
  ) {
    this.accountHeader = this.activeRoute.snapshot["queryParams"]["title"];
    commonService.updateData(router.url);
  }

  ngOnInit(): void {
    const sessionData = JSON.parse(sessionStorage.getItem("basisDetails"));
    this.openAccountService
      .getProcessCycle(sessionData.processCycleCode)
      .subscribe((resp) => {
        this.openAccountService
          .getProcessStages(resp.data.processStageList[0].id)
          .subscribe((resp) => {
            this.screenList = resp.data.screens.sort((s1, s2) => {
              return s1.sequence - s2.sequence;
            });
          });
      });
    console.log(this.screenList);
  }

  onVerify() {
    this.isPersonalDetailsTab = true;
    this.isMobileVerificationTab = false;
    this.isSelectKYCTab = false;
    this.stepper.next();
  }

  onExit() {
    this.router.navigate(["/"]);
  }

  getTabDetails(tabDetails: any) {
    if (tabDetails) {
      this.isMobileVerificationTab = tabDetails.isMobileVerification;
      this.isPersonalDetailsTab = tabDetails.isPersonalDetails;
      this.isSelectKYCTab = tabDetails.isSelectKYC;
      this.stepper = tabDetails.stepper;
    }
  }

  personalDetailsSubmitted() {
    this.isPersonalDetailsTab = false;
    this.isMobileVerificationTab = false;
    this.isSelectKYCTab = true;
    this.stepper.next();
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
      customerId: parseInt(localStorage.getItem("customerId")),
      documentInfo: docIds,
    };
    this.openAccountService
      .uploadMultipleDocument(payload)
      .subscribe((resp) => {
        if (resp?.statusCode === 200 || resp?.statusCode === 201) {
          this.openAccountService
            .getCustomerById(resp.data.customerId)
            .subscribe((resp) => {
              const sessionData = JSON.parse(
                sessionStorage.getItem("basisDetails")
              );
              const payload = {
                originationModel: {
                  applicationDate: moment(new Date()).format("YYYY-MMM-DD"),
                  accountType: sessionData.accountType,
                  basisDetailsId: sessionData.basisDetailsId,
                  branchCode: "BR1",
                },
                customerInfo: resp.data,
              };
              this.openAccountService
                .saveCustomerInfo(payload)
                .subscribe((resp) => {
                  if (resp?.statusCode === 200) {
                    this.dialog.open(SuccessPopupComponent, {
                      data: {
                        originationId: resp.data.originationModel.originationId,
                      },
                      width: "750px",
                      disableClose: true,
                      panelClass: "popup-dialog-class",
                      backdropClass: "bdrop",
                    });
                  }
                });
            });
        }
      });
    // console.log(docIds);
  }
}
