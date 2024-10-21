import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { SessionService } from "app/shared/session.service";
import { FundTransferService } from "../fund-transfer.service";
import { Router } from "@angular/router";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CustomSuccessPopupComponent } from "app/shared/components/custom-success-popup/custom-success-popup.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { OpenAccountService } from "app/shared/services/open-service/open-account.service";
import { AllInOnePopupComponent } from "app/shared/components/all-in-one-popup/all-in-one-popup.component";
import { TokenStorageService } from "app/shared/token-storage.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-single-fund-transfer",
  templateUrl: "./single-fund-transfer.component.html",
  styleUrls: ["./single-fund-transfer.component.scss"]
})
export class SingleFundTransferComponent implements OnInit {
  fundTransferForm: FormGroup;
  purpose = ["Salary", "Vendor"];
  fromAccount = [];
  transferMode = [];
  transferTo = [];
  benificiaryEmail = [];
  benificiaryMobile = [];
  remitter: boolean = false;
  beneficiary: boolean = false;
  beneficiaryNarration: boolean = false;
  remitterNarration: boolean = false;
  paymentDetail: boolean = false;
  custAccounts: any;
  dialogRef: MatDialogRef<CustomSuccessPopupComponent>;
  dialogRef1: MatDialogRef<AllInOnePopupComponent>;
  customerInfo: any;
  beneficiaryName: any;
  corporateId: any;
  constructor(
    private fb: FormBuilder,
    private fundTransferService: FundTransferService,
    private router: Router,
    private dialog: MatDialog,
    private api: OpenAccountService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService
  ) {
    this.matIconRegistry.addSvgIcon(
      `single-trans-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        "assets/images/single-trans.svg"
      )
    );
  }

  ngOnInit(): void {
    this.corporateId = JSON.parse(sessionStorage.getItem("corporateId"));
    this.buildForm();
    this.customerInfo = JSON.parse(sessionStorage.getItem("customer-Info"));
    this.custAccounts = JSON.parse(sessionStorage.getItem("listOfAccounts"));
    this.custAccounts.forEach((element) => {
      this.fromAccount.push(element.accountNo);
    });
    this.fetchBenificiary();
    this.fetchGeneric();
    setTimeout(() => {
      let lang = this.tokenStorageService.getLanguage() ?? "en";
      this.translate.use(lang);
    }, 300);
  }

  buildForm() {
    this.fundTransferForm = this.fb.group({
      purposeOfPayment: ["", Validators.required],
      debitAccount: ["", Validators.required],
      debitAmount: ["", Validators.required],
      transferMode: [""],
      creditAccount: ["", Validators.required],
      trransferOn: ["", Validators.required],
      remmitterEmail: [""],
      remmitterMobile: [""],
      benificiaryEmail: [""],
      benificiaryMobile: [""],
      remmitterNarration: [""],
      benificiaryNarration: [""],
      detail1: [""],
      detail2: [""],
      detail3: [""],
      remarks: [""]
    });
  }

  fetchBenificiary() {
    this.fundTransferService
      .fetchBenificiary(this.customerInfo?.customerId)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          let list = resp?.data;
          this.transferTo = list?.filter(
            (item) => item?.name && item?.accountNo
          );
        }
      });
  }

  fetchGeneric() {
    this.fundTransferService
      .fetchGeneric("Common", "TRANSFERMODE")
      .subscribe((resp: any) => {
        this.transferMode = resp?.data?.TRANSFERMODE;
      });
  }

  onCheckBox(checkbox: string, event: MatCheckboxChange) {
    if (event.checked) {
      if (checkbox === "Remitter") this.remitter = true;
      else if (checkbox === "Beneficiary") this.beneficiary = true;
      else if (checkbox === "RemitterNarration") this.remitterNarration = true;
      else if (checkbox === "BeneficiaryNarration")
        this.beneficiaryNarration = true;
      else if (checkbox === "paymentDetail") this.paymentDetail = true;
    } else {
      if (checkbox === "Remitter") this.remitter = false;
      else if (checkbox === "Beneficiary") this.beneficiary = false;
      else if (checkbox === "RemitterNarration") this.remitterNarration = false;
      else if (checkbox === "BeneficiaryNarration")
        this.beneficiaryNarration = false;
      else if (checkbox === "paymentDetail") this.paymentDetail = false;
    }
  }

  changeInToAccount(event) {
    if (event) {
      this.beneficiaryName = this.transferTo.find(
        (e) => e.accountNo == event
      )?.name;
    }
  }

  goToBeneificiary() {
    this.router.navigate(["user/trade/beneficiary/add-edit-beneficiary"]);
  }

  cancel() {
    this.router.navigate([
      "user/dashboard/fund-transfer/fund-transfer-summary"
    ]);
  }

  clear() {
    this.fundTransferForm.reset();
  }

  getOTP() {
    this.api
      .getOtp(this.customerInfo.mobileNumber)
      .subscribe((response: any) => {});
  }

  saveData(payload) {
    this.fundTransferService
      .saveFundTransferData(payload)
      .subscribe((resp: any) => {
        if (resp?.statusCode == 200) {
          this.dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
            data: {
              msg: "Transaction Successful",
              status: true,
              reffNo: resp?.data
            },
            width: "40%",
            disableClose: true,
            panelClass: "popup-class",
            backdropClass: "bdrop"
          });
          this.dialogRef.afterClosed().subscribe((result) => {
            console.log(result);
            if (result == "Done") {
              this.cancel();
            }
          });
        }
      });
  }

  submit() {
    if (!this.fundTransferForm.valid) return;
    let payload = [];
    let obj = this.fundTransferForm.value;
    obj.uploadType = "SINGLE";
    obj.beneficiaryName = this.beneficiaryName;
    payload.push(obj);

    this.getOTP();
    this.dialogRef1 = this.dialog.open(AllInOnePopupComponent, {
      data: { remark: true, mobile: this.customerInfo.mobileNumber },
      width: "50%",
      height: "33%",
      disableClose: true,
      panelClass: "popup-dialog-class",
      backdropClass: "bdrop"
    });
    this.dialogRef1.afterClosed().subscribe((result) => {
      if (result == "verified") {
        this.saveData(payload);
      } else {
        this.dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
          data: { msg: "Transaction failed", status: false },
          width: "40%",
          disableClose: true,
          panelClass: "popup-class",
          backdropClass: "bdrop"
        });
        this.dialogRef.afterClosed().subscribe((result) => {
          if (result == "Failed") {
            this.dialogRef.close();
          }
        });
      }
    });
  }
}
