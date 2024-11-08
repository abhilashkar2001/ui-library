import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import * as moment from "moment";
import { Location } from "@angular/common";
import { ServiceCallHandler } from "app/shared/service-call.handler";
import { MatLegacyDialog as MatDialog } from "@angular/material/legacy-dialog";
import { TokenStorageService } from "app/shared/token-storage.service";

@Component({
  selector: "app-payment-details",
  templateUrl: "./payment-details.component.html",
  styleUrls: ["./payment-details.component.scss"],
})
export class PaymentDetailsComponent implements OnInit {
  @Input("paymentDetails") paymentDetails: any;
  @Input() status: string;
  operationType: string;
  @Input("response") response: any;
  docCol = [
    {
      headerDef: "documentName",
      headerCell: "Document Name",
    },
    {
      headerDef: "documentNumber",
      headerCell: "Document Number",
    },
    {
      headerDef: "fileUpload",
      headerCell: "File Upload",
    },
    {
      headerDef: "addressProof",
      headerCell: "Address Proof",
    },
    {
      headerDef: "primary",
      headerCell: "Primary",
    },
  ];

  paymentDetailsArr = [
    {
      eventType: "addPayee",
      operationType: "Transfer_Money",
      masterId: "benificiaryMasterId",
      retailBeneficiaryMasterId: 1234,

      // status: "confirm",
      // statusHeader: "Comfirm Details",
      // statusNews: "",
      status: "success",
      statusHeader: "Payee Details",
      statusNews: "Payee Added successfully!",
      // status: "failed",
      // statusHeader: "Payee Details",
      // statusNews: "Payee Adding failed!",
      refNo: "R10034",
      payerDetails: {
        payerName: "Srihari.G",
        accountNo: "9872627",
        bank: "WBC",
      },
      summary: [
        {
          header: "Payee Details",
          details: [
            { Name: "Prem" },
            { "Account No": "8726327867678" },
            { "Confirm Account Number": "8726327867678" },
            { "Account Branch": "Whitefield" },
            { "Bank Code": "HDFC78566" },
            { "Nick Name": "Sri" },
            { "Mobile No": "87876789890" },
            { "Email ID": "Sri@gmail.com" },
          ],
        },
        {
          header: "Send To",
          details: [
            { Name: "Prem" },
            { "Account No": "8726327867678" },
            { "Confirm Account Number": "8726327867678" },
            { "Account Branch": "Whitefield" },
            { "Bank Code": "HDFC78566" },
            { "Nick Name": "Sri" },
            { "Mobile No": "87876789890" },
            { "Email ID": "Sri@gmail.com" },
          ],
        },
        {
          header: "Send From",
          details: [
            { Name: "Prem" },
            { "Account No": "8726327867678" },
            { "Confirm Account Number": "8726327867678" },
            { "Account Branch": "Whitefield" },
            { "Bank Code": "HDFC78566" },
            { "Nick Name": "Sri" },
            { "Mobile No": "87876789890" },
            { "Email ID": "Sri@gmail.com" },
          ],
        },
      ],
      qrToggle: true,
    },
  ];
  download: Blob;
  key: string;
  masterId: any;
  customerInfo: any;
  profileInfo: any;

  constructor(
    private matIconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    private router: Router,
    private location: Location,
    private dialog: MatDialog,
    private tokenStorageService: TokenStorageService
  ) {
    this.matIconRegistry.addSvgIcon(
      "edit-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/edit_pen.svg"
      )
    );
    // this.matIconRegistry.addSvgIcon(
    //   "download-icon",
    //   this.sanitizer.bypassSecurityTrustResourceUrl(
    //     "assets/images/svg/download.svg"
    //   )
    // );
    // this.matIconRegistry.addSvgIcon(
    //   "share-icon",
    //   this.sanitizer.bypassSecurityTrustResourceUrl(
    //     "assets/images/svg/share.svg"
    //   )
    // );
    this.matIconRegistry.addSvgIcon(
      "info-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/info_yellow.svg"
      )
    );
    // this.matIconRegistry.addSvgIcon(
    //   "fav-icon",
    //   this.sanitizer.bypassSecurityTrustResourceUrl(
    //     "assets/images/svg/favourite.svg"
    //   )
    // );
    // this.matIconRegistry.addSvgIcon(
    //   "delete-icon",
    //   this.sanitizer.bypassSecurityTrustResourceUrl(
    //     "assets/images/svg/delete.svg"
    //   )
    // );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes?.status?.currentValue) {
        this.paymentDetailsArr[0].status = changes.status.currentValue;
        console.log(this.paymentDetailsArr[0].status);
      }
    }
  }

  ngOnInit(): void {
    this.paymentDetailsArr = this.paymentDetails;
    this.customerInfo = JSON.parse(sessionStorage.getItem("customer-Info"));
    this.profileInfo = this.tokenStorageService.getUser();
  }
  done() {
    this.router.navigate(["user/dashboard"]);
  }
  edit() {
    this.location.back();
  }
  back() {
    this.location.back();
  }
  favourite() {}

  pay() {
    this.router.navigate(["/send-money/dashboard/transfer-money"], {
      state: { paymentDetails: this.paymentDetails },
    });
  }
}
