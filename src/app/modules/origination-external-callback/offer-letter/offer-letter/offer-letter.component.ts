import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { OfferIssueService } from "app/shared/services/offer-issue.service";
import { TokenStorageService } from "app/shared/token-storage.service";
import * as moment from "moment";

@Component({
  selector: "app-offer-letter",
  templateUrl: "./offer-letter.component.html",
  styleUrls: ["./offer-letter.component.scss"],
})
export class OfferLetterComponent implements OnInit {
  pdfSrc =
    "D:/Icust Workspace/loan-account-module-ui/src/assets/json/sample.pdf";
  currentUser: any;
  dataLocalUrl: any;
  originationId: any;
  constructor(
    private offerIssueService: OfferIssueService,
    private tokenStorageService: TokenStorageService,
    private domSanitizer: DomSanitizer,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.tokenStorageService.getUser();
    this.originationId = JSON.parse(sessionStorage.getItem("originationId"));
    this.offerIssueService
      .downloadOfferletter(this.originationId)
      .subscribe((res: any) => {
        var blob = new Blob([res], { type: "application/pdf" });
        this.dataLocalUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
          window.URL.createObjectURL(blob)
        );
        this.dataLocalUrl.changingThisBreaksApplicationSecurity =
          this.dataLocalUrl.changingThisBreaksApplicationSecurity +
          "#toolbar=0";
      });
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
}
