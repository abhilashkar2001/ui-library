import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-payment-page",
  templateUrl: "./payment-page.component.html",
  styleUrls: ["./payment-page.component.scss"]
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  resp: any;
  paymentDetails: any;
  status: string | any;
  response: any;
  scheduleSummary: boolean = false;
  download: Blob | any;
  payeeFrom: any;
  customerInfo: any;
  profileInfo: any;
  constructor(
    private serviceCallHandler: ServiceCallHandler,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService
  ) {
    this.matIconRegistry.addSvgIcon(
      "download-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/download-white.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "share-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/share.svg"
      )
    );
  }

  ngOnInit(): void {
    this.customerInfo = JSON.parse(
      <string>sessionStorage.getItem("customer-Info")
    );
    this.profileInfo = this.tokenStorageService.getUser();
    this.paymentDetails = this.serviceCallHandler.get("serviceHandler", true);
    if (this.paymentDetails[0]?.eventType == "schedule-payment")
      this.scheduleSummary = true;
    else this.scheduleSummary = false;
  }

  async serviceCall(event: any) {
    if (event) {
      this.resp = await this.serviceCallHandler.get("serviceHandler", false);
      this.status = this.resp?.status;
      this.response = this.resp?.res?.data;
    }
  }

  ngOnDestroy(): void {
    this.serviceCallHandler.remove("serviceHandler");
  }
}
