import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { OfferIssueService } from "app/shared/services/offer-issue.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";
import { SignNowPopupComponent } from "../../digital-sign/sign-now-popup/sign-now-popup.component";
import { SuccessModalComponent } from "../../digital-sign/success-modal/success-modal.component";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { OriginationService } from "app/shared/services/origination.service";
import { BranchService } from "../../digital-sign/sign-now-popup/branch.service";
import { MatIconRegistry } from "@angular/material/icon";
import { SessionStorageEnum } from "app/enum/session-storage.enum";
import { EmailService } from "app/shared/services/email.service";

@Component({
  selector: "app-offer-letter",
  templateUrl: "./offer-letter.component.html",
  styleUrls: ["./offer-letter.component.scss"],
})
export class OfferLetterComponent implements OnInit {
  currentUser: any;
  dataLocalUrl: any;
  originationId: any;
  signatureId: any;
  customerInfo: any;
  download: any;
  constructor(
    private offerIssueService: OfferIssueService,
    private tokenStorageService: TokenStorageService,
    private domSanitizer: DomSanitizer,
    private route: Router,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
    private originationService: OriginationService,
    private branchService: BranchService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.originationId = JSON.parse(sessionStorage.getItem("originationId"));
    this.customerInfo = this.sessionStorageService.getCustomerInfo();
    this.generatePdf();
  }

  generatePdf() {
    this.offerIssueService
      .downloadOfferletter(this.originationId)
      .subscribe((res: any) => {
        this.download = new Blob([res], { type: "application/pdf" });
        this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(this.download)
        );
        this.dataLocalUrl.changingThisBreaksApplicationSecurity =
          this.dataLocalUrl.changingThisBreaksApplicationSecurity +
          "#toolbar=0";
      });
  }

  handleDownload() {
    const url = window.URL.createObjectURL(this.download);

    // Create a link element and simulate a click to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `Offer Letter.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup the link element
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  saveCustomerResponse(response) {
    const payload: any = {};
    payload.dateOfOfferAcceptOrReject = moment(new Date()).format(
      "DD-MMM-YYYY"
    );
    payload.customerResponse = response;
    payload.originationId = this.originationId;
    this.offerIssueService
      .postOfferAcceptRejectDetails(payload)
      .subscribe((res) => {
        if ((res?.statusCode === 200 || res?.statusCode == 201) && res?.data) {
          if (response == "Accept") this.route.navigate(["/origination/otp"]);
          else if (response == "Reject")
            this.route.navigate(["/origination/remark"]);
          else this.route.navigate(["/origination/process-offer"]);
        }
      });
  }

  openEsign() {
    const dialogRef = this.dialog.open(SignNowPopupComponent, {
      disableClose: false,
      width: "60%",
      data: { signatureId: this.signatureId, title: "Sign Now" },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res?.result?.signatureId) {
        const signPayload = {
          originationId: JSON.parse(sessionStorage.getItem("originationId")),
          signatureId: res?.result?.signatureId,
          screenCode: JSON.parse(
            sessionStorage.getItem(SessionStorageEnum.SCREEN_ID)
          ),
        };
        this.branchService
          .saveDigitalSignDetails(signPayload)
          .subscribe((result) => {
            if (result?.statusCode === 200 || result?.statusCode === 201) {
              let payload = {
                originationId: this.sessionStorageService.getOriginationId(),
                status: "CONFIRMED",
                userName: "WEBSITE",
                department: "CUSTOMER",
                remarks: "Upload signature",
                code: "REVSIGN",
                nextDepartment: "SALES DEPARTMENTS",
              };
              this.saveUpdate(payload);
              const sucessDialog = this.dialog.open(SuccessModalComponent, {
                width: "40%",
                data: {
                  screenType: "Sign Now",
                  title: "Digital sign has been successfully recorded!",
                },
                disableClose: true,
              });
              sucessDialog.afterClosed().subscribe((_) => {
                this.triggerEmail();
                setTimeout(() => {
                  window.close();
                }, 5000);
              });
            }
          });
      } else {
        window.close();
      }
    });
  }
  saveUpdate(payload) {
    this.originationService
      .updateApprovalStatus(payload)
      .subscribe((res: any) => console.log(res));
  }

  triggerEmail() {
    const formData: FormData = new FormData();
    formData.append("subject", "Thank you for submitting your signature.");
    formData.append(
      "body",
      `Dear ${this.customerInfo?.firstName} ${this.customerInfo?.lastName},\n
      
We are pleased to inform you that your signature for loan application ${this.customerInfo?.icustRefNo} have been successfully uploaded.\n

Our team will review your signature and update you shortly regarding the next steps.\n

Thank you for your cooperation`
    );
    formData.append("to", this.customerInfo?.contact?.email);
    this.emailService
      .triggerTransactionEmail(formData)
      .subscribe((res: string) => {
        if (res) {
        }
      });
  }
}
