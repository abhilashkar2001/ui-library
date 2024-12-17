import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { FundTransferService } from '../fund-transfer.service';
import { Router } from '@angular/router';
import { CustomSuccessPopupComponent } from 'app/shared/components/custom-success-popup/custom-success-popup.component';
import { AllInOnePopupComponent } from 'app/shared/components/all-in-one-popup/all-in-one-popup.component';
import { OpenAccountService } from 'app/shared/services/open-service/open-account.service';
import { TokenStorageService } from 'app/shared/token-storage.service';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-credit-card-payment',
  templateUrl: './credit-card-payment.component.html',
  styleUrls: ['./credit-card-payment.component.scss'],
})
export class CreditCardPaymentComponent implements OnInit {
  today = new Date();
  showSendAdviceBlock = false;
  showNarrationBlock = false;
  creditCardForm!: FormGroup;
  selectList = [];
  aanList = [
    { label: '000037560058', value: '000037560058' },
    { label: '000037560078', value: '000037560078' },
    { label: '000037560069', value: '000037560069' },
  ];
  customerInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private fundTransferService: FundTransferService,
    private router: Router,
    private dialog: MatDialog,
    private api: OpenAccountService,
    private tokenStorageService: TokenStorageService,
    public translate: TranslateService,
  ) {
    this.matIconRegistry.addSvgIcon(
      `card-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/card_payment.svg',
      ),
    );
    this.matIconRegistry.addSvgIcon(
      `calendar-icon`,
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        'assets/images/calendar.svg',
      ),
    );
  }

  ngOnInit(): void {
    this.buildCreditCardForm();
    // Subscribe to value changes of the remitter checkbox
    this.creditCardForm.get('remitter')?.valueChanges.subscribe((value) => {
      this.showSendAdviceBlock = value;
    });
    this.creditCardForm.get('narration')?.valueChanges.subscribe((value) => {
      this.showNarrationBlock = value;
    });
    this.fetchCustomerInfo();
    setTimeout(() => {
      const lang = this.tokenStorageService.getLanguage() ?? 'en';
      this.translate.use(lang);
    }, 300);
  }
  buildCreditCardForm() {
    this.creditCardForm = this.formBuilder.group({
      debitAccount: ['', Validators.required],
      debitAmount: ['', Validators.required],
      transferOn: ['', Validators.required],
      remitter: [false],
      remitterEmail: [''],
      remitterMobile: [''],
      narration: [false],
      remitterNarration: [''],
      creditAmount: [''],
      creditAccount: ['', [Validators.required]],
    });
  }

  fetchCustomerInfo() {
    this.selectList = JSON.parse(
      <string>sessionStorage.getItem('listOfAccounts'),
    );
    this.customerInfo = JSON.parse(
      <string>sessionStorage.getItem('customer-Info'),
    );
  }

  close() {
    this.router.navigate(['/user/dashboard']);
  }

  clear() {
    this.creditCardForm.reset();
  }

  submit() {
    const payload = { ...this.creditCardForm.value };
    payload.creditAmount = payload.debitAmount;
    this.getOTP();
    const dialogRef1 = this.dialog.open(AllInOnePopupComponent, {
      data: {
        remark: true,
        mobile: this.tokenStorageService.getUser()?.mobile,
      },
      width: '50%',
      height: '33%',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
    dialogRef1.afterClosed().subscribe((result) => {
      if (result == 'verified') {
        this.saveData(payload);
      } else {
        const dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
          data: { msg: 'Payment failed!!!', status: false },
          width: '40%',
          disableClose: true,
          panelClass: 'popup-class',
          backdropClass: 'bdrop',
        });
        dialogRef.afterClosed().subscribe((result) => {
          if (result == 'Failed') {
            dialogRef.close();
          }
        });
      }
    });
  }
  getOTP() {
    this.api
      .getOtp(this.tokenStorageService.getUser()?.mobile)
      .subscribe(() => {});
  }

  saveData(payload: any) {
    this.fundTransferService.saveCreditCard(payload).subscribe((res) => {
      if (res?.statusCode == 200) {
        const dialogRef = this.dialog.open(CustomSuccessPopupComponent, {
          data: { msg: 'Payment Successful', status: true, reffNo: res?.data },
          width: '40%',
          disableClose: true,
          panelClass: 'popup-class',
          backdropClass: 'bdrop',
        });
        dialogRef.afterClosed().subscribe((result) => {
          console.log(result);
          if (result == 'Done') {
            this.close();
          }
        });
      }
    });
  }
}
