import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SessionStorageService } from 'app/shared/services/session-storage.service';
import { CreditcardService } from '../../../../creditcard.service';
import { MatDialog } from '@angular/material/dialog';
import { PopupSuccessComponent } from '../../../../../../../shared-corporate-banking/popup-success/popup-success.component';

@Component({
  selector: 'app-increase-limit',
  templateUrl: './increase-limit.component.html',
  styleUrls: ['./increase-limit.component.scss'],
})
export class IncreaseLimitComponent implements OnInit {
  increaseLimitForm!: FormGroup;
  selectedCurrency = 'INR';
  viewOtp = false;
  creditCardList: any;
  customerID: number | any;
  fourDigitNo: string | any;
  mobileNo: string | any;
  otp: any;
  customerInfo: any;
  cardList: any[] | any;
  userInfo: any;
  constructor(
    private fb: FormBuilder,
    private creditCardService: CreditcardService,
    private ss: SessionStorageService,
    // private otpService: OTPService,
    private dialog: MatDialog,
    private sessionStorageService: SessionStorageService,
  ) {}

  ngOnInit(): void {
    this.initIncreaseLimitForm();
    this.getCreditCardDetailsList();
    this.customerInfo = this.ss.getCustomerInfo();
    this.userInfo = this.sessionStorageService.getAuthUser();
    this.cardList = this.ss.getListOfCards();
    this.fourDigitNo = this.userInfo?.mobile.substr(6, 10);
    console.log(this.fourDigitNo);
  }

  getCreditCardDetailsList() {
    const list = this.ss.getListOfCards()?.map((item) => ({
      cardNo: item.cardNumber,
      cardValue: item.cardNumber,
    }));
    this.creditCardList = list;
  }

  getCreditCardLimitByNo(e: any) {
    console.log('e  === ', e);
    // const ccNo:number = this.increaseLimitForm.get('cardNo').value;
    this.creditCardService.getEligibleAmount(e).subscribe((res: any) => {
      console.log('res : ', res);
      // this.increaseLimitForm.patchValue({
      //   eligibleCreditLimit: res.data.eligibleCreditLimit
      // });
      this.increaseLimitForm.get('eligibleCreditLimit')?.setValue(res.data);
    });
  }

  initIncreaseLimitForm() {
    this.increaseLimitForm = this.fb.group({
      cardNo: ['', [Validators.required]],
      eligibleCreditLimit: ['', [Validators.required]],
      otp: [''],
    });

    // this.increaseLimitForm.get('cardNo').valueChanges.subscribe(cardNo => {
    //   if (cardNo) {
    //     this.getCreditCardLimitByNo(cardNo); // Call method when card number changes
    //   }
    // });
  }

  proceedToOtp() {
    this.viewOtp = true;
    this.creditCardService
      .generateOTP(this.userInfo?.mobile)
      .subscribe((res: any) => {
        this.otp = res.data;
        // this.increaseLimitForm.get("otp").setValue(this.otp);
      });
  }

  submitEligibleLimit() {
    this.otp = this.increaseLimitForm.get('otp')?.value;
    const payload = {
      mobile: this.mobileNo,
      otp: this.otp,
    };
    this.creditCardService.verifyOtp(payload).subscribe((res: any) => {
      if (res) {
        const formData = this.increaseLimitForm.value;
        this.creditCardService
          .saveCreditLimitDetails(formData.cardNo, formData.eligibleCreditLimit)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp) {
              const dialogRef = this.dialog.open(PopupSuccessComponent, {
                data: {
                  status: 'SuccessOnly',
                  Msg: 'Card limit has been set',
                },
                disableClose: true,
                panelClass: 'popup-dialog-class',
                backdropClass: 'bdrop',
                width: '25%',
              });
              dialogRef.afterClosed().subscribe((res) => {
                console.log(res);
                if (res == 'Yes') {
                  this.increaseLimitForm.reset();
                  this.viewOtp = false;
                }
              });
            }
          });
      }
    });
  }
}
