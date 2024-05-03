import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { TokenStorageService } from "app/@core/security/token-storage.service";
import { DownloadService } from "app/@core/services/download.service";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import * as moment from "moment";

@Component({
  selector: "app-payment-page",
  templateUrl: "./payment-page.component.html",
  styleUrls: ["./payment-page.component.scss"],
})
export class PaymentPageComponent implements OnInit, OnDestroy {
  resp: any;
  paymentDetails: any;
  status: string;
  response: any;
  scheduleSummary: boolean = false;
  download: Blob;
  payeeFrom: any;
  customerInfo: any;
  profileInfo: any;
  constructor(
    private serviceCallHandler: ServiceCallHandler,
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private downloadService: DownloadService,
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
    this.customerInfo = JSON.parse(sessionStorage.getItem("customer-Info"));
    this.profileInfo = this.tokenStorageService.getUser();
    this.paymentDetails = this.serviceCallHandler.get("serviceHandler", true);
    if (this.paymentDetails[0]?.eventType == "schedule-payment")
      this.scheduleSummary = true;
    else this.scheduleSummary = false;
  }

  async serviceCall(event) {
    if (event) {
      this.resp = await this.serviceCallHandler.get("serviceHandler", false);
      this.status = this.resp?.status;
      this.response = this.resp?.res?.data;
    }
  }

  getPdf(value) {
    this.payeeFrom = this.paymentDetails[0]?.payeeFrom;
    this.downloadService
      .downloadPayee(
        this.payeeFrom,
        this.paymentDetails[0]?.benificiaryMasterId
      )
      .subscribe((res: any) => {
        this.download = new Blob([res], {
          type: "application/octet-stream",
        });
        if (value) this.downloadPdf();
        else this.share();
      });
  }
  downloadPdf() {
    const url = window.URL.createObjectURL(this.download);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.payeeFrom}${moment(new Date()).format("DD-MM-YYYY")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  share() {
    const pdfFile = new File([this.download], `${this.payeeFrom}.pdf`, {
      type: "application/pdf",
    });
    const formData = new FormData();
    formData.append(
      "subject",
      `${this.customerInfo?.customerName}${moment(new Date()).format("DD-MM-YYYY")}`
    );
    formData.append("body", "Refer below attached pdf");
    formData.append("to", `${this.profileInfo?.email}`);
    formData.append("filePath", pdfFile, pdfFile.name);
    this.downloadService
      .triggerEmail(formData)
      .subscribe((res) => console.log(res));
  }

  ngOnDestroy(): void {
    this.serviceCallHandler.remove("serviceHandler");
  }
}
