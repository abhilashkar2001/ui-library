import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SuccessPopupComponent } from 'app/shared/components/success-popup/success-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SessionStorageService } from 'app/shared/services/session-storage.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
  @Input() depositType: string | any;
  @Input() email: string | any;
  paymentForm!: FormGroup;
  upiPaymentForm!: FormGroup;
  netBankPaymentForm!: FormGroup;
  tansferPaymentForm!: FormGroup;
  isTransferProceed = false;
  originId: string | any;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sessionStorageService: SessionStorageService,
  ) {}

  cardType = [
    { bankLogo: 'assets/images/axis_bank_logo.svg', bankName: 'Axis Bank ' },
    { bankLogo: 'assets/images/hdfc_bank_logo.svg', bankName: 'HDFC Bank ' },
    { bankLogo: 'assets/images/icici_bank_logo.svg', bankName: 'ICICI Bank' },
  ];
  paymentMethod = new FormControl('Card');
  config = {
    allowNumbersOnly: false,
    length: 4,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '80px',
      height: '80px',
    },
  };

  ngOnInit(): void {
    this.buildPayentForm();
  }
  buildPayentForm() {
    this.paymentForm = this.fb.group({});
    this.upiPaymentForm = this.fb.group({});
    this.netBankPaymentForm = this.fb.group({});
    this.tansferPaymentForm = this.fb.group({});
  }
  processTransferPayment() {
    this.isTransferProceed = true;
  }

  continuePayment() {
    if (this.sessionStorageService.getDepositOriginationId())
      this.originId = this.sessionStorageService.getDepositOriginationId();
    this.dialog.open(SuccessPopupComponent, {
      data: {
        originationId: this.originId,
        type: this.depositType,
        email: this.email,
      },
      width: '750px',
      disableClose: true,
      panelClass: 'popup-dialog-class',
      backdropClass: 'bdrop',
    });
  }
}
