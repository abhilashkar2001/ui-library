import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { DownloadService } from "app/@core/services/download.service";
import * as moment from "moment";
import { Location } from "@angular/common";
import { EditDomesticComponent } from "app/modules/view-payee/domestic/edit-domestic/edit-domestic.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { TokenStorageService } from "app/@core/security/token-storage.service";
import { EditInternationalComponent } from "app/modules/view-payee/international/edit-international/edit-international.component";
import { PopUpComponent } from "../pop-up/pop-up.component";
import { ViewPayeeService } from "app/modules/view-payee/view-payee.service";
import { ServiceCallHandler } from "app/shared/service-call.handler";

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
  docCol=[
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
    }
  ];

  dialogRef: MatDialogRef<EditDomesticComponent>;
  dialogRefInternation: MatDialogRef<EditInternationalComponent>;
  dialogRefDelete: MatDialogRef<PopUpComponent>;

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
    private downloadService: DownloadService,
    private location: Location,
    private dialog: MatDialog,
    private tokenStorageService: TokenStorageService,
    private viewPayeeService: ViewPayeeService
  ) {
    this.matIconRegistry.addSvgIcon(
      "edit-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/edit_pen.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "download-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/download.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "share-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/share.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "info-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/info_yellow.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "fav-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/favourite.svg"
      )
    );
    this.matIconRegistry.addSvgIcon(
      "delete-icon",
      this.sanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/svg/delete.svg"
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      if (changes?.status?.currentValue) {
        this.paymentDetailsArr[0].status = changes.status.currentValue;
        console.log( this.paymentDetailsArr[0].status);
        
      }
    }
  }

  ngOnInit(): void {
    this.paymentDetailsArr = this.paymentDetails;
    this.customerInfo = JSON.parse(sessionStorage.getItem("customer-Info"));
    this.profileInfo = this.tokenStorageService.getUser();
  }
  done() {
    this.router.navigate(["/dashboard"]);
  }
  edit() {
    this.location.back();
  }
  back() {
    this.location.back();
  }
  favourite() { }

  getPdf(value) {
    this.key = this.paymentDetailsArr[0]?.masterId;
    this.operationType = this.paymentDetailsArr[0]?.operationType;
    this.masterId = this.response[this.key];
    if (this.operationType == "I" || this.operationType == "D")
      this.downloadService
        .downloadPayee(this.operationType, this.masterId)
        .subscribe((res: any) => {
          this.download = new Blob([res], { type: "application/octet-stream" });
          if (value) this.downloadPdf();
          else this.share();
        });
    else
      this.downloadService
        .downloadSendMoney(this.operationType, this.masterId)
        .subscribe((res: any) => {
          this.download = new Blob([res], {
            type: "application/octet-stream",
          });
          if (value) this.downloadPdf();
          else this.share();
        });
  }
  pay() {
    this.router.navigate(["/send-money/dashboard/transfer-money"], {
      state: { paymentDetails: this.paymentDetails },
    });
  }

  downloadPdf() {
    const url = window.URL.createObjectURL(this.download);

    // Create a link element and simulate a click to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${this.operationType}${moment(new Date()).format("DD-MM-YYYY")}.pdf`;
    document.body.appendChild(link);
    link.click();

    // Cleanup the link element
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  share() {
    const pdfFile = new File([this.download], `${this.operationType}.pdf`, {
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
  deletePayee() {
    this.dialogRefDelete = this.dialog.open(PopUpComponent, {
      data: { status: "Cancel", Msg: "Delete the Payee", Remark: false },
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop",
    });
    this.dialogRefDelete.afterClosed().subscribe((result) => {
      if (result) {
        this.viewPayeeService
          .deleteBeneficiary(this.paymentDetails?.[0]?.benificiaryMasterId)
          .subscribe((res) => {
            if (res) {
              if (this.paymentDetails[0]?.summary[0]?.details[2]["Account No"])
                this.router.navigate(["/view-payee/dashboard/international"]);
              else this.router.navigate(["/view-payee/dashboard/domestic"]);
            }
          });
      }
    });
  }
  editPayee() {
    if (this.paymentDetails[0]?.summary[0]?.details[2]["Account No"]) {
      this.dialogRefInternation = this.dialog.open(EditInternationalComponent, {
        data: this.paymentDetails,
        disableClose: true,
        panelClass: "popup-dialog-class",
        backdropClass: "bdrop",
      });
    } else {
      this.dialogRef = this.dialog.open(EditDomesticComponent, {
        data: this.paymentDetails,
        disableClose: true,
        panelClass: "popup-dialog-class",
        backdropClass: "bdrop",
      });
    }
  }
}
