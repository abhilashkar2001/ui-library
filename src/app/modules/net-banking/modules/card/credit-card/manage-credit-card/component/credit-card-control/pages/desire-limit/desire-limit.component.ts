import { Component, OnInit } from "@angular/core";
import { CreditcardService } from "../../../../creditcard.service";
import { SessionStorageService } from "app/shared/services/session-storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { debounceTime } from "rxjs/operators";
import { PopupSuccessComponent } from "app/shared/components/popup-success/popup-success.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-desire-limit",
  templateUrl: "./desire-limit.component.html",
  styleUrls: ["./desire-limit.component.scss"],
})
export class DesireLimitComponent implements OnInit {
  desiredLimitForm: FormGroup;
  selectedCurrency: string = "INR";
  max: number = 140000;
  min: number = 5000;
  currencySymbol = "₹";
  thumbLabel: boolean = true;
  viewOtp: boolean = false;
  creditCardList: { cardNo: any; cardValue: any }[];
  cardNoDetails: any;
  customerID: any;
  mobileNo: any;
  fourDigitNo: any;
  otp: any;
  increaseLimitForm: any;
  selecetdCardNo: { cardNo: any; cardValue: any }[];
  customerInfo: any;
  cardList: any[];
  userInfo: any;

  constructor(
    private fb: FormBuilder,
    private service: CreditcardService,
    private ss: SessionStorageService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.customerInfo = this.ss.getCustomerInfo();
    this.cardList = this.ss.getListOfCards();
    this.userInfo = JSON.parse(sessionStorage.getItem("auth-user"));
    this.fourDigitNo = this.userInfo?.mobile.substr(6, 10);
    this.initCardControlForm();
    this.getCreditCardDetailsList();
  }

  initCardControlForm() {
    this.desiredLimitForm = this.fb.group({
      cardNumber: ["", [Validators.required]],
      eligibleCreditLimit: ["", [Validators.required]],
      otp: [""],
    });
    this.desiredLimitForm
      .get("cardNumber")
      .valueChanges.pipe(debounceTime(200))
      .subscribe((val) => {
        console.log(val);
        if (val) {
          this.cardDetailsFetch();
          this.getCreditCardLimitByNo(val);
          this.selecetdCardNo = this.creditCardList.filter(
            (item) => item?.cardNo == val
          );
          console.log(this.selecetdCardNo);
        }
      });
  }

  onSliderChange(e) {
    this.desiredLimitForm.get("eligibleCreditLimit").setValue(e?.value);
  }

  formatCurrencyLabel(value) {
    return `₹ ${value}`;
  }

  proceedToOtp() {
    this.viewOtp = true;
    this.service.generateOTP(this.userInfo?.mobile).subscribe((res: any) => {
      this.otp = res.data;
      this.increaseLimitForm.get("otp").setValue(this.otp);
    });
  }
  cardDetailsFetch() {
    let cardNo = this.desiredLimitForm.get("cardNumber").value;
    this.service.getDesiredCreditCardList(cardNo).subscribe((res: any) => {
      console.log(res);
      if (res && res.statusCode == 200) {
        this.cardNoDetails = res?.data;
      }
    });
  }
  getCreditCardDetailsList() {
    const cardList = this.ss.getListOfCards();

    if (Array.isArray(cardList)) {
      const list = cardList.map((item) => ({
        cardNo: item.cardNumber,
        cardValue: item.cardNumber,
      }));
      this.creditCardList = list;
    } else {
      this.creditCardList = [];
    }

    console.log(this.creditCardList);
  }

  getCreditCardLimitByNo(e: any) {
    console.log("e  === ", e);
    // const ccNo:number = this.increaseLimitForm.get('cardNo').value;
    this.service.getEligibleAmount(e).subscribe((res: any) => {
      console.log("res : ", res);
      // this.increaseLimitForm.patchValue({
      //   eligibleCreditLimit: res.data.eligibleCreditLimit
      // });
      this.desiredLimitForm.get("eligibleCreditLimit").setValue(res?.data);
    });
  }
  submit() {
    this.otp = this.desiredLimitForm.get("otp").value;
    let payload = {
      mobile: this.mobileNo,
      otp: this.otp,
    };
    this.service.verifyOtp(payload).subscribe((res: any) => {
      if (res) {
        const formData = this.desiredLimitForm.value;
        this.service
          .saveDesiredLimit(formData.cardNumber, formData.eligibleCreditLimit)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp) {
              const dialogRef = this.dialog.open(PopupSuccessComponent, {
                data: {
                  status: "SuccessOnly",
                  Msg: "Card limit has been set",
                },
                disableClose: true,
                panelClass: "popup-dialog-class",
                backdropClass: "bdrop",
                width: "25%",
              });
              dialogRef.afterClosed().subscribe((res) => {
                console.log(res);
                if (res == "Yes") {
                  this.desiredLimitForm.reset();
                  this.cardNoDetails = [];
                  this.viewOtp = false;
                }
              });
            }
          });
      }
    });
  }
}
